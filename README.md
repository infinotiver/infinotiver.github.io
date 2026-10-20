# 1nf1n0t1v3r (infinotiver@github)

hi i'm a frontend developer and a self-taught programmer. i like to make websites and web apps, along with some backend stuff. i code for fun and for learning new things. currently loving linux and cybersecurity.

## how does this website work?

### what is the "code"?
the code is one number from 0 to 19439 and it decides the whole look of the site. same code = same site, always.

where does 19440 come from? i can choose 1 of 6 variants, 1 of 3 heading fonts, 1 of 3 body fonts and 1 of 360 hues:

`6 × 3 × 3 × 360 = 19440`

so every look has its own code, no two codes give the same look.

the only truly random step is `Math.floor(Math.random() * 19440)`, which picks the code.

### what happens after the code is picked?

**1. scramble it**

`(code * 8191) % 19440`

without this, codes 1 and 2 would look almost the same (same variant, hue 1° apart). `%` means "what's left over", like a clock: `15 % 12 = 3`.

this only works if 8191 and 19440 share no factors. 19440 = 2⁴ × 3⁵ × 5 and 8191 is prime, so they don't. that guarantees every code lands on a different number, no repeats.

tiny example with 10 instead of 19440 and 3 instead of 8191: codes 0 to 9 become `0, 3, 6, 9, 2, 5, 8, 1, 4, 7`. every number shows up exactly once.

**2. unpack it (like a bike lock with 4 wheels of different sizes: 360, 3, 3, 6)**

`%` reads the wheel and `Math.floor(n / size)` moves to the next one. example with code 777:

- scramble: `777 × 8191 = 6,364,407`, and `6,364,407 % 19440 = 7527`
- hue: `7527 % 360 = 327` (19440 doesn't matter here, 360 × 20 = 7200, left over 327). then `floor(7527 / 360) = 20`
- body font: `20 % 3 = 2` → 3rd body font. then `floor(20 / 3) = 6`
- heading font: `6 % 3 = 0` → 1st heading font. then `floor(6 / 3) = 2`
- variant: slot 2 = netscape


### what happens next?

so `hue` is just an angle on a color wheel, like 0° is red, 60° is yellow, 120° is green and so on. 360° is the same as 0° (full circle), which is why the range is 0 to 359.

is some hue more common than others? no. the scramble gives every code a different number, so every hue appears exactly `19440 / 360 = 54` times across all codes.

the variant gets set as `data-v="..."` on `<html>`, the fonts and hue go into `--fh`, `--fb` and `--h`, and only the 2 chosen fonts get downloaded from google fonts.

### inspiration:
ngl but i had this idea in my dream after i dozed off watching Marvel's WandaVision (from 2021). i was thinking about how the show had different "eras" and how each era had its own look, and i thought it would be fun to make a website that does the same thing. so i did try to make something.

## contact:
- main site: https://infinotiver.com
- mirror: https://infinotiver.is-a.dev
- email: infinotiver@proton.me
