import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const width = Math.sqrt(this.props.squares.length);
        let rows = [];
        for (let i = 0; i < width; i++) {
            let cols = [];
            for (let j = 0; j < width; j++) {
                const square = this.renderSquare(i * width + j);
                cols.push(square);
            }

            rows.push(
                <div key={i} className="board-row">
                    {cols}
                </div>
            );
        }

        return <div>{rows}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    index: null
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }
    jumpTo(step) {
        this.setState({
            history: this.state.history,
            stepNumber: step,
            xIsNext: step % 2 === 0
        });
    }
    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat({ squares: squares, index: i }),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    render() {
        const history = [...this.state.history];
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        const winner = calculateWinner(squares);
        const endedGame = calculateEnd(squares);

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (endedGame) {
            status = 'End game. No winner';
        } else {
            status = 'Next player: ' + (this.props.xIsNext ? 'X' : 'O');
        }

        const moves = history.map((step, move) => {
            let desc;
            if (step && step.index != null) {
                const index = step.index + 1;
                const [row, column] = [Math.ceil(index / 3), index % 3];
                desc = 'Go to move (' + row + ', ' + column + ')';
            } else {
                desc = move ? 'Go to move #' + move : 'Go to game start';
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateEnd(squares) {
    return squares.every(s => s !== null);
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
