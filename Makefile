# Ashigaru Terminal ships an amd64-only .deb, so we build for x86_64 only.
ARCHES := x86
# overrides to s9pk.mk must precede the include statement
include s9pk.mk

# On a clean checkout `start-cli s9pk list-ingredients` can return nothing
# (no node_modules/bundle yet), which leaves $(INGREDIENTS) empty and makes
# `pack` run before the JS bundle exists. The s9pk targets always run
# `make ingredients` before packing, so attach the bundle there (an explicit
# target — pattern-rule prerequisites would not merge into the pack recipe).
ingredients: javascript/index.js
