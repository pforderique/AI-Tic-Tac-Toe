# AI Tic Tac Toe

This simple Tic Tac Toe game written with [p5js](https://p5js.org/) sets the user against a computer player that uses the [minimax algorithm](https://en.wikipedia.org/wiki/Minimax) to calculate its next best move! 


## How to Play

Refine your Tic-Tac-Toe skills against the minimax algorithm! To play, either visit [here](https://preview.p5js.org/pforderique/present/tCbcLYShi) or download the code and open with [LiveShare](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) on VSCode.

## Improvements

Several known imporvements can yet be made to this project. 

For starters, the `minimax` algorithm currently does not use the `depth` parameter supplied. This parameter could serve to improve the algorithm's decision by rewarding moves that lead to computer victories in less moves.

```javascript
function minimax(depth, maximizing) {
    // penalize minimax score return based on depth here...
}
```

Addtionally, there are many areas for code cleaning (getting rid of unused lines, adding more helpful comments, etc.) and UI rampup that need attending. 