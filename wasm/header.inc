#ruledef {
	rst => 0x00
	
	ora b => 0x01
	ora c => 0x02
	ora {addr: u16} => 0x03 @ le(addr)
	ora #{imm: u8} => 0x04 @ imm
	ora {addr: u16}, b => 0x05 @ le(addr)
	ora ({addr: u16}, b) => 0x06 @ le(addr)
	ora ({addr: u16}), c => 0x07 @ le(addr)
	
	int => 0x08

	xor b => 0x09
	xor c => 0x0a
	xor {addr: u16} => 0x0b @ le(addr)
	xor #{imm: u8} => 0x0c @ imm
	xor {addr: u16}, b => 0x0d @ le(addr)
	xor ({addr: u16}, b) => 0x0e @ le(addr)
	xor ({addr: u16}), c => 0x0f @ le(addr)

	clc => 0x20

	and b => 0x21
	and c => 0x22
	and {addr: u16} => 0x23 @ le(addr)
	and #{imm: u8} => 0x24 @ imm
	and {addr: u16}, b => 0x25 @ le(addr)
	and ({addr: u16}, b) => 0x26 @ le(addr)
	and ({addr: u16}), c => 0x27 @ le(addr)

	sec => 0x28

	cmp b => 0x29
	cmp c => 0x2a
	cmp {addr: u16} => 0x2b @ le(addr)
	cmp #{imm: u8} => 0x2c @ imm
	cmp {addr: u16}, b => 0x2d @ le(addr)
	cmp ({addr: u16}, b) => 0x2e @ le(addr)
	cmp ({addr: u16}), c => 0x2f @ le(addr)

	clv => 0x40
	
	ada b => 0x41
	ada c => 0x42
	ada {addr: u16} => 0x43 @ le(addr)
	ada #{imm: u8} => 0x44 @ imm
	ada {addr: u16}, b => 0x45 @ le(addr)
	ada ({addr: u16}, b) => 0x46 @ le(addr)
	ada ({addr: u16}), c => 0x47 @ le(addr)

	sev => 0x48

	sba b => 0x49
	sba c => 0x4a
	sba {addr: u16} => 0x4b @ le(addr)
	sba #{imm: u8} => 0x4c @ imm
	sba {addr: u16}, b => 0x4d @ le(addr)
	sba ({addr: u16}, b) => 0x4e @ le(addr)
	sba ({addr: u16}), c => 0x4f @ le(addr)

	cli => 0x60
	
	lda b => 0x61
	lda c => 0x62
	lda {addr: u16} => 0x63 @ le(addr)
	lda #{imm: u8} => 0x64 @ imm
	lda {addr: u16}, b => 0x65 @ le(addr)
	lda ({addr: u16}, b) => 0x66 @ le(addr)
	lda ({addr: u16}), c => 0x67 @ le(addr)

	sei => 0x68
	
	ldb => 0x69
	ldb c => 0x6a
	ldb {addr: u16} => 0x6b @ le(addr)
	ldb #{imm: u8} => 0x6c @ imm
	ldb {addr: u16}, c => 0x6d @ le(addr)
	ldb ({addr: u16}, c) => 0x6e @ le(addr)
	ldb ({addr: u16}), c => 0x6f @ le(addr)
	
	jsr {addr: u16} => 0xa0 @ le(addr)

	ldc => 0xa1
	ldc b => 0xa2
	ldc {addr: u16} => 0xa3 @ le(addr)
	ldc #{imm: u8} => 0xa4 @ imm
	ldc {addr: u16}, b => 0xa5 @ le(addr)
	ldc ({addr: u16}, b) => 0xa6 @ le(addr)
	ldc ({addr: u16}), b => 0xa7 @ le(addr)

	rts => 0xa8
	
	jcc {addr: u16} => 0xa9 @ le(addr)
	jcs {addr: u16} => 0xaa @ le(addr)
	jvc {addr: u16} => 0xab @ le(addr)
	jvs {addr: u16} => 0xac @ le(addr)
	jzc {addr: u16} => 0xad @ le(addr)
	jzs {addr: u16} => 0xae @ le(addr)
	jmp {addr: u16} => 0xaf @ le(addr)

	jic {addr: u16} => 0xc0 @ le(addr)
	jnc {addr: u16} => 0xc1 @ le(addr)
	jns {addr: u16} => 0xc2 @ le(addr)
	shl => 0xc3
	shl b => 0xc4
	shl c => 0xc5
	rol => 0xc6
	rol b => 0xc7
	
	nop => 0xc8
	
	shr => 0xc9
	shr b => 0xca
	shr c => 0xcb
	rol c => 0xcc
	ror => 0xcd
	ror b => 0xce
	ror c => 0xcf

	nop #{imm: u8} => 0xe0 @ imm

	inc => 0xe1
	inc b => 0xe2
	inc c => 0xe3
	inc {addr: u16} => 0xe4 @ le(addr)
	inc {addr: u16}, b => 0xe5 @ le(addr)
	inc ({addr: u16}, b) => 0xe6 @ le(addr)
	inc ({addr: u16}), c => 0xe7 @ le(addr)

	nop {addr: u16} => 0xe8 @ le(addr)

	dec => 0xe9
	dec b => 0xea
	dec c => 0xeb
	dec {addr: u16} => 0xec @ le(addr)
	dec {addr: u16}, b => 0xed @ le(addr)
	dec ({addr: u16}, b) => 0xee @ le(addr)
	dec ({addr: u16}), c => 0xef @ le(addr)

	sta {addr: u16} => 0xf2 @ le(addr)
	sta {addr: u16}, b => 0xf3 @ le(addr)
	sta ({addr: u16}, b) => 0xf4 @ le(addr)
	sta ({addr: u16}), c => 0xf5 @ le(addr)
	
	stb {addr: u16} => 0xf6 @ le(addr)
	stb {addr: u16}, c => 0xf7 @ le(addr)
	stb ({addr: u16}, c) => 0xf8 @ le(addr)
	stb ({addr: u16}), c => 0xf9 @ le(addr)
	
	stc {addr: u16} => 0xfa @ le(addr)
	stc {addr: u16}, b => 0xfb @ le(addr)
	stc ({addr: u16}, b) => 0xfc @ le(addr)
	stc ({addr: u16}), b => 0xfd @ le(addr)
}

#bankdef code {
	#addr 0x8000
	#size 0x7ffc
	#outp 0
	#fill
}