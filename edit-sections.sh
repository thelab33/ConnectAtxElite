#!/bin/bash
SECTIONS="hero mission sponsor_wall testimonials tiers"
for f in $SECTIONS; do
  nano "$f.html"
  echo "Done with $f.html. Press any key to continue..."
  read -n 1 -s
done

