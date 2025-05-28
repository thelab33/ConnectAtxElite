#!/usr/bin/env bash
# scaffold_connect_atx.sh – Bootstraps a modular Flask site for Connect ATX Elite

set -e

echo "📂 Creating folders..."
mkdir -p templates/partials static/css static/images static/js

echo "📄 Creating key templates and partials..."

# ---- base.html ----
cat > templates/base.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{% block title %}Connect ATX Elite{% endblock %}</title>
  <link rel="stylesheet" href="{{ url_for('static', filename='css/index.css') }}">
  {% block head %}{% endblock %}
</head>
<body>
  {% block content %}{% endblock %}
</body>
</html>
EOF

# ---- index.html ----
cat > templates/index.html <<'EOF'
{% extends "base.html" %}
{% block title %}Home · Connect ATX Elite{% endblock %}
{% block content %}
  {% include "partials/hero.html" %}
  {% include "partials/mission.html" %}
  {% include "partials/stats.html" %}
  {% include "partials/challenge.html" %}
  {% include "partials/impact.html" %}
  {% include "partials/tiers.html" %}
  {% include "partials/testimonials.html" %}
  {% include "partials/cta.html" %}
  {% include "partials/footer.html" %}
{% endblock %}
EOF

# ---- hero.html ----
cat > templates/partials/hero.html <<'EOF'
<section id="hero" class="hero-section">
  <img src="{{ url_for('static', filename='images/ring-photo.avif') }}" alt="Connect ATX Elite team showing championship rings" class="hero-image">
  <img src="{{ url_for('static', filename='images/logo-atx-elite.png') }}" alt="Connect ATX Elite Logo" class="hero-logo">
  <h1>Connect ATX Elite</h1>
  <h2>Empowering Youth Through Basketball, Brotherhood, and Academic Excellence</h2>
  <a href="#tiers" class="cta-button">Become a Sponsor</a>
  <div class="fundraising-bar">
    💰 $7,900 raised of <strong>$10,000</strong> goal
  </div>
  <blockquote>“Winning felt amazing — but it’s being part of a team that believes in you that means the most.”<br>
    <span class="author">— Connect ATX Elite Player, Class of 2030</span>
  </blockquote>
</section>
EOF

# ---- mission.html ----
cat > templates/partials/mission.html <<'EOF'
<section id="mission" class="mission-section">
  <h2>Our Mission</h2>
  <p>
    Connect ATX Elite is a community-powered, non-profit 12U AAU basketball program based in Austin, TX.
    We are committed to developing not only skilled athletes, but confident, disciplined, and academically driven young leaders.
  </p>
  <p>
    Our boys — many of whom are honor roll students — are growing up in a positive environment rooted in teamwork, mentorship, and integrity.
    Through basketball, we teach life lessons that extend far beyond the court.
  </p>
</section>
EOF

# ---- stats.html ----
cat > templates/partials/stats.html <<'EOF'
<section id="stats" class="stats-section">
  <ul>
    <li><strong>16</strong> Players Enrolled</li>
    <li><strong>11</strong> Honor Roll Scholars</li>
    <li><strong>12</strong> Tournaments Played</li>
    <li><strong>3</strong> Years Running</li>
  </ul>
</section>
EOF

# ---- challenge.html ----
cat > templates/partials/challenge.html <<'EOF'
<section id="challenge" class="challenge-section">
  <h2>The Challenge We Face</h2>
  <p>
    Despite the love and energy behind our program, we struggle with consistent access to gym space and the high cost of tournament travel across states.
    These financial barriers place a heavy strain on our volunteer coaches and passionate parents — limiting the full potential of our kids to grow, bond, and succeed together.
  </p>
</section>
EOF

# ---- impact.html ----
cat > templates/partials/impact.html <<'EOF'
<section id="impact" class="impact-section">
  <h2>The Impact You Can Make</h2>
  <ul>
    <li>Secure a consistent gym space for practices</li>
    <li>Support travel & lodging costs for tournaments</li>
    <li>Provide uniforms, gear, meals, and hydration</li>
    <li>Fund academic support and mentorship programs</li>
  </ul>
  <p>
    With your help, we can build the foundation these young athletes need to become the confident, accomplished men our community deserves.
  </p>
  <div class="contact-blurb">
    Want to make the biggest impact?<br>
    Contact us at <a href="mailto:arodgps@gmail.com">arodgps@gmail.com</a> or scan to sponsor instantly.
  </div>
  <img src="{{ url_for('static', filename='images/qr-sponsor.png') }}" alt="Sponsor via QR Code" class="qr-code">
  <div>Goal: <strong>$10,000</strong></div>
</section>
EOF

# ---- tiers.html ----
cat > templates/partials/tiers.html <<'EOF'
<section id="tiers" class="tiers-section">
  <h2>Sponsorship Tiers</h2>
  <ul>
    <li><strong>Platinum</strong> – $5,000+<br>
      <span>Logo on jerseys, website, banners · Shoutouts on social media · VIP event invitations</span></li>
    <li><strong>Gold</strong> – $2,500<br>
      <span>Logo on team warmups · Social media features · Sponsor appreciation invites</span></li>
    <li><strong>Silver</strong> – $1,000<br>
      <span>Social media shoutouts · Thank-you certificate · Sponsor board listing</span></li>
    <li><strong>Bronze</strong> – $500<br>
      <span>Public thank-you · Sponsor board listing</span></li>
    <li><strong>Custom</strong> – Any Amount<br>
      <span>Tailored benefits that match your mission. We’ll work with you to personalize your impact!</span></li>
  </ul>
  <button class="faq-btn">▶ Frequently Asked Questions</button>
</section>
EOF

# ---- testimonials.html ----
cat > templates/partials/testimonials.html <<'EOF'
<section id="testimonials" class="testimonials-section">
  <div class="stars">★★★★★ (5.0)</div>
  <h2>What They’re Saying</h2>
  <blockquote>
    🎉🎊✨ “Winning felt amazing — but it’s being part of a team that believes in you that means the most.”
    <span class="author">— Connect ATX Elite Player, Class of 2030</span>
    <a href="#" onclick="navigator.clipboard.writeText('Winning felt amazing — but it’s being part of a team that believes in you that means the most. — Connect ATX Elite Player, Class of 2030'); return false;">Copy Quote</a>
  </blockquote>
  <img src="{{ url_for('static', filename='images/ring-photo.avif') }}" alt="Team showing off championship rings" class="testimonial-image">
</section>
EOF

# ---- cta.html ----
cat > templates/partials/cta.html <<'EOF'
<section id="cta" class="cta-section">
  <h2>Ready to Join Our Mission?</h2>
  <p>With your help, we can build something powerful — a future where young athletes are equipped not only to win games, but to win at life.</p>
  <div class="fundraising-bar">
    💰 8,250 raised of 10,000 goal
  </div>
  <a href="mailto:arodgps@gmail.com" class="cta-button">Become a Sponsor</a>
  <img src="{{ url_for('static', filename='images/qr-sponsor.png') }}" alt="Donate QR Code" class="qr-code">
  <div class="contact-info">
    Or contact us directly at <a href="mailto:arodgps@gmail.com">arodgps@gmail.com</a> | 📞 (512) 820-0475
  </div>
</section>
EOF

# ---- footer.html ----
cat > templates/partials/footer.html <<'EOF'
<footer class="footer-section">
  <p>© 2025 Connect ATX Elite. All rights reserved.</p>
  <p>AAU 12U | Austin, TX</p>
  <div>Raised $8,250 / $10,000</div>
  <nav class="footer-links">
    <a href="mailto:arodgps@gmail.com">📧 Email</a>
    <a href="https://www.connectatxelite.com">🌐 Site</a>
    <a href="#">💸 Donate</a>
    <span>Contact: arodgps@gmail.com</span>
    <span>Phone: (512) 820-0475</span>
    <a href="mailto:arodgps@gmail.com">🤝 Become a Sponsor</a>
  </nav>
</footer>
EOF

# ---- css/index.css (basic styles as a start) ----
cat > static/css/index.css <<'EOF'
body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0a; color: #fff; margin: 0; }
h1, h2 { color: #facc15; }
.hero-section, .mission-section, .tiers-section, .cta-section, .footer-section {
  margin: 3rem auto; max-width: 800px; padding: 2rem; background: #18181b99; border-radius: 1.5rem;
  box-shadow: 0 2px 30px #facc1520;
}
.cta-button, .faq-btn { background: #facc15; color: #111; border: none; border-radius: 1.2rem; padding: 1rem 2.5rem; margin-top: 1.2rem; font-weight: bold; cursor: pointer; transition: background .2s; }
.cta-button:hover, .faq-btn:hover { background: #ffe066; }
.hero-image, .testimonial-image, .qr-code { max-width: 240px; border-radius: 1.1rem; margin: 1.2rem 0; }
.fundraising-bar { background: #232323; color: #facc15; padding: .7rem 1.4rem; border-radius: 1rem; margin: 1rem 0; display: inline-block; }
.footer-links { display: flex; flex-wrap: wrap; gap: 1.2rem; margin-top: 1rem; }
.stats-section ul { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; }
.stats-section li { font-size: 1.25rem; background: #292929; padding: 1rem 2rem; border-radius: 1rem; color: #ffe066; }
.stars { font-size: 1.6rem; color: #ffe066; }
a { color: #ffe066; text-decoration: none; }
a:hover { text-decoration: underline; }
EOF

echo "✅ Project scaffold complete!"
echo "👉 Now, add your images (logo, ring-photo.avif, qr-sponsor.png) to static/images/ and run your Flask app!"

echo "🔥 You’re ready to start winning sponsors! Edit the partials as you see fit. Good luck, Coach!"

