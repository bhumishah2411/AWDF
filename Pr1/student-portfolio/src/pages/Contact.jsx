import { useState } from 'react'

function Contact() {
    const [message, setMessage] = useState('')
    const [showTip, setShowTip] = useState(false)

    return (
        <section className="card">
            <h2>Contact Me</h2>

            <button className="contact-btn" onClick={() => setShowTip(!showTip)}>
                {showTip ? 'Hide tip' : 'Show tip'}
            </button>
            {showTip && <p className="tip">Tip: keep your message under 200 characters.</p>}

            <textarea
                className="contact-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <p className="char-count">{message.length} characters</p>
        </section>
    )
}
export default Contact