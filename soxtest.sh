#!/bin/sh
sox -b 16 -d -t flac - rate 16000 channels 1 silence 1 0.1 0.1% 1 1.0 0.5% > noise.flac
sox noise.flac -n stat | grep RMS
#sox -b 16 -d -t flac - rate 16000 channels 1 silence 1 0.1 0.1% 1 1.0 0.5% > out.flac
#play out.flac
#sox out.flac -n stat | grep RMS
