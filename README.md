# Optimise LEGO plates placement

The current example finds a placement for a World Map, but it can be repurposed by changing `map.bmp` for another image.

Install dependencies:
```bash
npm install
```

Run:
```bash
npm start
```

Input:

![input](https://github.com/JosephMarinier/lego/blob/master/map.bmp)

Output:

![output](https://github.com/JosephMarinier/lego/blob/master/lego_result.png)

```bash
13 × PLATE 8X8          @   1.03 =  13.39
5 × PLATE 6X8           @   0.86 =   4.30
6 × PLATE 4X8           @   0.60 =   3.60
7 × PLATE 4X6           @   0.55 =   3.85
1 × PLATE 2X10          @   0.32 =   0.32
3 × PLATE 4X4           @   0.27 =   0.81
1 × PLATE 2X8           @   0.32 =   0.32
13 × PLATE 2X6          @   0.25 =   3.25
12 × PLATE 2X4          @   0.18 =   2.16
1 × PLATE 1X8           @   0.23 =   0.23
8 × PLATE 1X6           @   0.18 =   1.44
19 × PLATE 2X3          @   0.18 =   3.42
23 × PLATE 1X4          @   0.14 =   3.22
10 × PLATE 2X2          @   0.14 =   1.40
24 × CORNER PLATE 1X2X2 @   0.09 =   2.16
11 × PLATE 1X3          @   0.09 =   0.99
47 × PLATE 1X2          @   0.09 =   4.23
89 × PLATE 1X1          @   0.08 =   7.12
___________________________________________
293 ×                               56.21 $
```
