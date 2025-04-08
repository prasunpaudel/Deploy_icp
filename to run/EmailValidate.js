addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }

    if (request.method === 'POST' && url.pathname === '/submit-email') {
        try {
            const { email } = await request.json();
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return new Response(JSON.stringify({ success: false, error: 'Invalid email format' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
            }

            // Generate 4-digit PIN
            const pin = Math.floor(1000 + Math.random() * 9000).toString();
            
            // Store in KV with 10-minute expiration
            await EMAIL_VERIFICATION.put(email, pin, { expirationTtl: 600 });

            // Send PIN via Brevo
            const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': "",
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    sender: {
                        name: "Verification Service",
                        email: "dummyone137@gmail.com"
                    },
                    to: [{ email }],
                    subject: "Your Verification Code",
                    htmlContent: `<p>Your verification code is: <strong>${pin}</strong>. Thankyou for coming by  _Sarthak_aganja</p>`
                })
            });

            if (!brevoResponse.ok) {
                throw new Error('Failed to send PIN email');
            }

            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        } catch (error) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: error.message.includes('Brevo') ? 'Failed to send verification email' : 'Server error'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }
    }
    else if (request.method === 'POST' && url.pathname === '/verify-pin') {
        try {
            const { email, pin } = await request.json();
            
            // Retrieve stored PIN
            const storedPin = await EMAIL_VERIFICATION.get(email);
            
            if (!storedPin || storedPin !== pin) {
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: 'Invalid or expired PIN' 
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
            }

            // Send final email via Brevo
            const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': "",
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    sender: {
                        name: "Verification Service",
                        email: "dummyone137@gmail.com"
                    },
                    to: [{
                        email: "sarthak.aganja12345@gmail.com",
                        name: "Sarthak Aganja"
                    }],
                    subject: "New Verified Email",
                    htmlContent: `<p>New verified email: ${email}</p>`
                })
            });

            if (!brevoResponse.ok) throw new Error('Failed to send confirmation');
            
            // Cleanup stored PIN
            await EMAIL_VERIFICATION.delete(email);

            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        } catch (error) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Verification failed. Please try again.' 
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }
    }

    return new Response('Not found', { status: 404 });
}
