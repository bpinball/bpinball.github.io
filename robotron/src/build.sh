sdasz80 -l -o robotron.rel robotron.asm
sdcc -mz80 robotron.rel -o robotron --no-std-crt0
node hex_to_tap.js
zmakebas -o robotron_bas.tap -a 1 robotron.bas
cat robotron_bas.tap binary.tap > robotron.tap


