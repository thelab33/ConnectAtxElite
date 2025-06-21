#!/bin/bash

echo "🚀 Starting CSS file copy process..."

# Define source root
SRC="./ConnectAtxElite/connect_atx_elite/static/css"

# Copy individual partials
cp "$SRC/partials/about.css" ./src/components/sponsorship/About.module.css
cp "$SRC/partials/back_to_top.css" ./src/components/ui/BackToTop.module.css
cp "$SRC/partials/challenge.css" ./src/components/sponsorship/Challenge.module.css
cp "$SRC/partials/cta.css" ./src/components/sponsorship/Cta.module.css
cp "$SRC/partials/donation_modal.css" ./src/components/sponsorship/DonationModal.module.css
cp "$SRC/partials/faq.css" ./src/components/sponsorship/Faq.module.css
cp "$SRC/partials/footer.css" ./src/components/layout/Footer.module.css
cp "$SRC/partials/funding_goal_hud.css" ./src/components/sponsorship/FundingGoalHud.module.css
cp "$SRC/partials/header.css" ./src/components/layout/Header.module.css
cp "$SRC/partials/hero.css" ./src/components/sponsorship/Hero.module.css
cp "$SRC/partials/mission.css" ./src/components/sponsorship/Mission.module.css
cp "$SRC/partials/newsletter.css" ./src/components/sponsorship/Newsletter.module.css
cp "$SRC/partials/newsletter_modal.css" ./src/components/sponsorship/NewsletterModal.module.css
cp "$SRC/partials/sponsor_wall.css" ./src/components/sponsorship/SponsorWall.module.css
cp "$SRC/partials/stats.css" ./src/components/sponsorship/Stats.module.css
cp "$SRC/partials/testimonials.css" ./src/components/sponsorship/Testimonials.module.css
cp "$SRC/partials/tiers.css" ./src/components/sponsorship/Tiers.module.css

# Copy tier styles
cp "$SRC/tiers_v2/basic.css" ./src/components/sponsorship/tiers/Basic.module.css
cp "$SRC/tiers_v2/vip.css" ./src/components/sponsorship/tiers/Vip.module.css
cp "$SRC/tiers_v2/premium.css" ./src/components/sponsorship/tiers/Premium.module.css

# Append globals.css
cat "$SRC/globals.css" >> ./src/app/globals.css

echo "✅ CSS file copy complete!"
