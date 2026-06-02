# Ashigaru Terminal ships an amd64-only .deb, so we build for x86_64 only.
ARCHES := x86
# overrides to s9pk.mk must precede the include statement
include s9pk.mk
