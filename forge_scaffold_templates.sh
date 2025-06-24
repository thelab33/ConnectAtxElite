#!/bin/bash

# Scaffold directories if missing
mkdir -p ./app/templates

# Create base.html
cat << 'EOF' > ./app/templates/base.html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% block title %}Connect ATX Elite{% endblock %}</title>

  <link rel="icon" href="{{ url_for('static', filename='favicon.ico') }}">
  <link rel="apple-touch-icon" sizes="180x180" href="{{ url_for('static', filename='apple-touch-icon.png') }}">
  <link rel="manifest" href="{{ url_for('static', filename='site.webmanifest') }}">

  <meta name="description" content="Empowering youth through basketball, brotherhood, and academics in Austin, TX.">
  <meta property="og:title" content="Connect ATX Elite">
  <meta property="og:description" content="Empowering youth through basketball, brotherhood, and academics in Austin, TX.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{{ request.url }}">
  <meta property="og:image" content="{{ url_for('static', filename='images/social-preview.png') }}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Connect ATX Elite">
  <meta name="twitter:description" content="Empowering youth through basketball, brotherhood, and academics in Austin, TX.">
  <meta name="twitter:image" content="{{ url_for('static', filename='images/social-preview.png') }}">

  <link rel="stylesheet" href="{{ url_for('static', filename='tailwind.min.css') }}">
  {% block extra_styles %}{% endblock %}
</head>
<body class="bg-zinc-950 text-white leading-relaxed">
  <a href="#main-content" class="sr-only focus:not-sr-only fixed top-4 left-4 bg-primary text-black px-4 py-2 rounded shadow-lg z-50">
    Skip to main content
  </a>

  {% include "partials/header.html" %}

  <main id="main-content" tabindex="-1" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {% block content %}{% endblock %}
  </main>

  {% include "partials/footer.html" %}

  <div id="cookie-consent" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white text-sm rounded-full px-6 py-3 shadow-lg hidden z-50">
    We use cookies to improve your experience. By using our site, you agree to our
    <a href="/privacy" class="text-primary underline">Privacy Policy</a>.
    <button id="cookie-accept" class="ml-4 bg-primary text-black font-bold px-3 py-1 rounded-full">Accept</button>
  </div>

  <script src="{{ url_for('static', filename='js/bundle.min.js') }}" defer></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const banner = document.getElementById('cookie-consent');
      const button = document.getElementById('cookie-accept');
      if (!localStorage.getItem('cookieConsent')) {
        banner.style.display = 'block';
      }
      button.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        banner.style.display = 'none';
      });
    });
  </script>
  {% block scripts %}{% endblock %}
</body>
</html>
EOF

# Create index.html
cat << 'EOF' > ./app/templates/index.html
{% extends "base.html" %}

{% block title %}Home · Connect ATX Elite{% endblock %}

{% block content %}
<section class="text-center space-y-6 mb-12">
  <img src="{{ url_for('static', filename='logo.png') }}" alt="Connect ATX Elite Logo" class="h-24 mx-auto">
  <h1 class="text-4xl font-extrabold text-primary">Connect ATX Elite</h1>
  <p class="text-lg text-zinc-300 max-w-2xl mx-auto">
    Empowering Youth Through Basketball, Brotherhood & Academics
  </p>
</section>

<section class="bg-zinc-900 rounded-xl p-6 shadow-lg max-w-xl mx-auto text-center space-y-4 mb-12">
  <h2 class="text-2xl font-bold text-primary">Become a Sponsor</h2>
  <p class="text-yellow-300 font-semibold">
    💰 ${{ raised }} raised of ${{ goal }} goal —
    {% if deadline_active %}Deadline Active{% else %}Deadline Passed{% endif %}
  </p>
  <a href="#donate" class="inline-block bg-primary text-black font-bold py-2 px-6 rounded-full shadow hover:bg-yellow-400 transition">
    Donate Now
  </a>
</section>

<section class="max-w-3xl mx-auto space-y-6 text-center">
  <h2 class="text-2xl font-bold text-primary">The Challenge We Face</h2>
  <p class="text-zinc-300">
    We struggle with consistent gym space and the high cost of tournament travel.
  </p>
  <ul class="list-disc list-inside text-left text-zinc-300">
    <li>Secure a consistent gym space for practices</li>
    <li>Support travel & lodging costs for tournaments</li>
    <li>Provide uniforms, gear, meals, and hydration</li>
    <li>Fund academic support and mentorship programs</li>
  </ul>
</section>
{% endblock %}
EOF

echo "✅ Polished base.html and index.html scaffolded in ./app/templates"
