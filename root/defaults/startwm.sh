#!/bin/bash

# get rid of 'AT-SPI: Error retrieving accessibility bus address' warnings
export NO_AT_BRIDGE=1

# Make the mouse work inside Ashigaru Terminal (JavaFX) over KasmVNC.
#
# JavaFX uses the GTK "glass" backend on Linux, which by default consumes
# pointer input through XInput2 extended devices. KasmVNC's virtual pointer is
# not delivered correctly through XInput2, so the cursor moves but button
# presses are dropped (or mis-read as touch) — the window renders and the
# keyboard works, but nothing is clickable. Forcing GDK to use the legacy core
# X pointer events restores normal clicking. Exported here, before
# openbox-session, so every app the session launches (the auto-started wallet
# and any window opened from the right-click menu) inherits it.
export GDK_CORE_DEVICE_EVENTS=1

setterm blank 0
setterm powerdown 0

/usr/bin/openbox-session > /dev/null 2>&1
