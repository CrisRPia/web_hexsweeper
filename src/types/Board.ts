import { LogicCell } from "./LogicCell";
import { writable } from "svelte/store";

function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export class Board {
    cells: Array<Array<LogicCell>>;
    size: number;
    mines: number;
    flags: number = 0;
    orthogonalAdjacency: boolean;
    diagonalAdjacency: boolean;
    initialUnknowns: number;
    correctFlags: number = 0;
    punish: boolean;
    subscribe;
    setBoard;
    updateBoard;

    constructor(
        size: number,
        mines: number,
        adjacent: boolean = true,
        diagonal: boolean = true,
        unknowns: number = 0,
        punish: boolean = true,
        autogenerate: boolean = true
    ) {
        this.orthogonalAdjacency = adjacent;
        this.diagonalAdjacency = diagonal;
        this.initialUnknowns = unknowns;
        this.punish = punish;
        this.size = size;
        this.mines = mines;
        this.cells = this.generateBoard();
        if (autogenerate) {
            this.generateMines();
            this.assignValues();
            this.generateUnknowns();
        }

        const { subscribe, set, update } = writable(this);
        this.subscribe = subscribe;
        this.setBoard = set;
        this.updateBoard = update;

    }


    public expand(x: number, y: number) {
        let cell = this.cells[x][y];
        if (!cell.discovered || cell.mined || cell.forbidden) {
            return;
        }
        const flags = this.countAround(x, y, (c: LogicCell) => {
            return c.flagged;
        });
        const correctFlags = this.countAround(x, y, (c: LogicCell) => {
            return c.flagged && c.mined;
        });
        const knownMines = this.countAround(x, y, (c: LogicCell) => {
            return c.discovered && c.mined;
        });
        const fog = this.countAround(x, y, (c: LogicCell) => {
            return !c.discovered && !c.flagged && !c.forbidden;
        });

        if (
            fog + flags + knownMines === cell.value
            || flags + knownMines == cell.value
        ) {
            this.getNeighbors(x, y).forEach((n) => {
                if (flags == correctFlags) {
                    let c = this.cells[n[0]][n[1]];
                    if (c.mined && !c.discovered && !c.flagged) {
                        this.flag(n[0], n[1]);
                        return;
                    }
                }
                this.discover_animate(n[0], n[1]);
            });
        } else if (this.punish) {
            cell.forbidden = true;
        }
        this.updateBoard(() => this);
    }

    public hoverIn(x: number, y: number) {
        let ns = this.getNeighbors(x, y);
        ns.forEach((n) => {
            this.cells[n[0]][n[1]].highlighted = true;
        });
        this.updateBoard(() => this);
    }

    public hoverOut(x: number, y: number) {
        let ns = this.getNeighbors(x, y);
        ns.forEach((n) => {
            this.cells[n[0]][n[1]].highlighted = false;
        });
        this.updateBoard(() => this);
    }

    private generateMines() {
        for (let _ = 0; _ < this.mines; _++) {
            let i = randInt(0, this.size - 1);
            let j = randInt(0, this.size - 1);
            while (this.cells[i][j].mined) {
                i = randInt(0, this.size - 1);
                j = randInt(0, this.size - 1);
            }
            this.cells[i][j].mined = true;
        }
    }
    private generateUnknowns() {
        for (let _ = 0; _ < this.initialUnknowns; _++) {
            let i = randInt(0, this.size - 1);
            let j = randInt(0, this.size - 1);
            while (this.cells[i][j].mined) {
                i = randInt(0, this.size - 1);
                j = randInt(0, this.size - 1);
            }
            this.cells[i][j].forbidden = true;
        }
    }

    public flag(x: number, y: number) {
        let cell = this.cells[x][y];
        if (cell.discovered) {
            return;
        }
        cell.flagged = !cell.flagged;
        if (cell.mined) {
            this.correctFlags += (cell.flagged ? 1 : -1);
        }
        this.flags = this.flags + (cell.flagged ? 1 : -1);
        this.updateBoard(() => this);
    }

    public async discover_animate(x: number, y: number) {
        // FIX Generated by find, don't trust in this
        let cell = this.cells[x][y];
        if (cell.flagged || cell.forbidden) {
            return;
        }
        let currentLevel: Array<Array<number>> = [[x, y]];
        let nextLevel: Array<Array<number>> = [];
        let visited: Set<string> = new Set();
        visited.add(`${x},${y}`);
        let distance = 0;

        while (currentLevel.length > 0) {
            for (let coords of currentLevel) {
                cell = this.cells[coords[0]][coords[1]]
                if (cell.forbidden) {
                    continue;
                }
                if (cell.value == 0) {
                    this.getNeighbors(coords[0], coords[1]).forEach((neighbour) => {
                        let neighbourKey = `${neighbour[0]},${neighbour[1]}`;
                        let c = this.cells[neighbour[0]][neighbour[1]];
                        if (!c.discovered && !visited.has(neighbourKey)) {
                            nextLevel.push(neighbour);
                            visited.add(neighbourKey);
                        }
                    });
                }
                if (cell.flagged) {
                    this.flag(coords[0], coords[1]);
                }
                if (cell.mined) {
                    this.flags += cell.discovered ? 0 : 1;
                    this.correctFlags += cell.discovered ? 0 : 1;
                    cell.discovered = true;
                    this.updateBoard(() => this);
                    return;
                }
                cell.discovered = true;
                this.updateBoard(() => this);
            }
            await sleep(Math.max(50 / distance, 1)); // this will pause after each level
            distance += 1;
            currentLevel = nextLevel;
            nextLevel = [];
        }
    }

    private assignValues() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.cells[i][j].value = this.calculateValue(i, j);
            }
        }
    }

    private calculateValue(x: number, y: number) {
        return this.countAround(x, y, (c: LogicCell) => {
            return c.mined;
        });
    }

    getNeighbors(row: number, column: number) {
        let neighbours = [];

        const isEvenRow = row % 2 === 0;

        const orthogonal = isEvenRow
            ? [
                [row - 1, column - 1], // top-left
                [row - 1, column], // top-right
                [row, column - 1], // left
                [row, column + 1], // right
                [row + 1, column - 1], // bottom-left
                [row + 1, column], // bottom-right
            ]
            : [
                [row - 1, column], // top-left
                [row - 1, column + 1], // top-right
                [row, column - 1], // left
                [row, column + 1], // right
                [row + 1, column], // bottom-left
                [row + 1, column + 1], // bottom-right
            ];

        const diagonal = isEvenRow
            ? [
                [row - 1, column - 2],// diagonal top-left
                [row - 2, column],// diagonal top
                [row - 1, column + 1],// diagonal top-right
                [row + 1, column - 2],// diagonal bottom-left
                [row + 2, column],// diagonal bottom
                [row + 1, column + 1]// diagonal bottom-right
            ]
            : [
                [row - 1, column - 1], // diagonal top-left
                [row - 2, column], // diagonal top
                [row - 1, column + 2],// diagonal top-right
                [row + 1, column - 1],// diagonal bottom-left
                [row + 2, column], // diagonal bottom
                [row + 1, column + 2]// diagonal bottom-right
            ]

        let potentialNeighbours: number[][] = [];
        if (this.orthogonalAdjacency) {
            potentialNeighbours = potentialNeighbours.concat(orthogonal);
        }
        if (this.diagonalAdjacency) {
            potentialNeighbours = potentialNeighbours.concat(diagonal);
        }


        for (const [nRow, nColumn] of potentialNeighbours) {
            if (nRow >= 0 && nColumn >= 0 && nRow < this.size && nColumn < this.size) {
                neighbours.push([nRow, nColumn]);
            }
        }

        return neighbours;
    }

    private countAround(x: number, y: number, checker: (c: LogicCell) => boolean): number {
        let neighbours = this.getNeighbors(x, y);
        let n = 0;

        neighbours.forEach((e) => {
            if (checker(this.cells[e[0]][e[1]])) {
                n++;
            }
        });
        return n;
    }

    private generateBoard(): Array<Array<LogicCell>> {
        let output = Array.from({ length: this.size }, () =>
            Array.from({ length: this.size }, () => new LogicCell())
        );
        return output;
    }
}
