# Ashigaru Terminal ships an amd64-only .deb, so we build for x86_64 only.
ARCHES := x86
# overrides to s9pk.mk must precede the include statement
include s9pk.mk

# On a clean checkout `start-cli s9pk list-ingredients` can return nothing
# (no node_modules/bundle yet), which leaves $(INGREDIENTS) empty and makes
# `pack` run before the JS bundle exists. Force the bundle (and therefore
# node_modules) to be built first by adding it as an explicit prerequisite.
$(BASE_NAME).s9pk: javascript/index.js
$(BASE_NAME)_%.s9pk: javascript/index.js
