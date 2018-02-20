import { Component, HostListener } from '@angular/core';
import { DotShapedShip } from '../models/dot-shaped-ship';
import { FourCellsShip } from '../models/four-cells-ship';

@Component({
    selector: 'game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})

export class GameComponent {
    board: any[] = [];
    conditions: any[] = [];
    dotShapedShips: DotShapedShip[] = [];
    firstStart = true;
    iShip: FourCellsShip = null;
    lShip: FourCellsShip = null;
    shootedShips = 0;
    shots: number[] = [];
    
    constructor() {
        this.createBoard();
    }
    
    @HostListener('window:keydown', ['$event'])
    keydown() {
        if (this.firstStart) {
            this.startGame();
        } else {
            if (this.shootedShips != 10) {
                this.shot();
            } else {
                this.startGame();
            }
        }
    }
    
    addConditions(position: number) {
        if(!((position-1)%10)) {
            this.conditions.push({ min: position-10, max: position-9 });
            this.conditions.push({ min: position, max: position+1 });
            this.conditions.push({ min: position+10, max: position+11 });
        } else if(!(position%10)) {
            this.conditions.push({ min: position-11, max: position-10 });
            this.conditions.push({ min: position-1, max: position });
            this.conditions.push({ min: position+9, max: position+10 });
        } else {
            this.conditions.push({ min: position-11, max: position-9 });
            this.conditions.push({ min: position-1, max: position+1 });
            this.conditions.push({ min: position+9, max: position+11 });
        }
    }
    
    createBoard() {
        for(let i=0; i<10; i++) {
            this.board.push([]);
            for(let j=0; j<10; j++) {
                this.board[i].push({ number: i*10+j+1, ship: null as any });
            }
        }
    }
    
    createDotShapedShips() {
        for(let i = 0; i < 2; i ++) {
            let position = this.getDotShapedShipPosition();
            this.addConditions(position);
            this.dotShapedShips.push({ position: position });
        }
    }
    
    createIShip() {
        this.iShip = {
            direction: Math.floor(Math.random()*2) ? 'VERTICAL' : 'HORIZONTAL',
            first: null,
            second: null,
            third: null,
            fourth: null
        };
        this.iShip.first = this.getIShipFirstPosition();
        switch (this.iShip.direction) {
            case 'VERTICAL':
                this.iShip.second = this.iShip.first+10;
                this.iShip.third = this.iShip.second+10;
                this.iShip.fourth = this.iShip.third+10;
                break;
            case 'HORIZONTAL':
                this.iShip.second = this.iShip.first+1;
                this.iShip.third = this.iShip.second+1;
                this.iShip.fourth = this.iShip.third+1;
                break;
        }
    }
    
    createLShip() {
        this.lShip = {
            direction: this.getLShipDirection(),
            first: null,
            second: null,
            third: null,
            fourth: null
        };
        this.lShip.first = this.getLShipFirstPosition();
        switch (this.lShip.direction) {
            case 'TOP-RIGHT':
                this.lShip.second = this.lShip.first+10;
                this.lShip.third = this.lShip.second+10;
                this.lShip.fourth = this.lShip.third+1;
                break;
            case 'TOP-LEFT':
                this.lShip.second = this.lShip.first+10;
                this.lShip.third = this.lShip.second+10;
                this.lShip.fourth = this.lShip.third-1;
                break;
            case 'BOTTOM-RIGHT':
                this.lShip.second = this.lShip.first-10;
                this.lShip.third = this.lShip.second-10;
                this.lShip.fourth = this.lShip.third+1;
                break;
            case 'BOTTOM-LEFT':
                this.lShip.second = this.lShip.first-10;
                this.lShip.third = this.lShip.second-10;
                this.lShip.fourth = this.lShip.third-1;
                break;
            case 'RIGHT-TOP':
                this.lShip.second = this.lShip.first-1;
                this.lShip.third = this.lShip.second-1;
                this.lShip.fourth = this.lShip.third-10;
                break;
            case 'RIGHT-BOTTOM':
                this.lShip.second = this.lShip.first-1;
                this.lShip.third = this.lShip.second-1;
                this.lShip.fourth = this.lShip.third+10;
                break;
            case 'LEFT-TOP':
                this.lShip.second = this.lShip.first+1;
                this.lShip.third = this.lShip.second+1;
                this.lShip.fourth = this.lShip.third-10;
                break;
            case 'LEFT-BOTTOM':
                this.lShip.second = this.lShip.first+1;
                this.lShip.third = this.lShip.second+1;
                this.lShip.fourth = this.lShip.third+10;
                break;
        }
    }
    
    fillBoard() {
        let filledCells = 0;
        for (let row of this.board) {
            for(let cell of row) {
                let findCell = false;
                for (let element in this.lShip) {
                    if (element != 'direction' && (this.lShip[element] == cell['number'])) {
                        cell['ship'] = this.lShip;
                        filledCells ++;
                        findCell = true;
                        break;
                    }
                }
                if(!findCell) {
                    for (let element in this.iShip) {
                        if (element != 'direction' && (this.iShip[element] == cell['number'])) {
                            cell['ship'] = this.iShip;
                            filledCells ++;
                            findCell = true;
                            break;
                        }
                    }
                }
                if(!findCell) {
                    for (let ship of this.dotShapedShips) {
                        if (ship.position == cell['number']) {
                            cell['ship'] = ship;
                            filledCells ++;
                            break;
                        }
                    }
                }
                if(filledCells == 10) {
                    return;
                }
            }
        }
    }
    
    getDotShapedShipPosition() {
        let position = Math.floor(Math.random()*(100-1+1))+1;
        for (let condition of this.conditions) {
            if(position <= condition['max'] && position >= condition['min']) {
                return this.getDotShapedShipPosition();
            }
        }
        return position;
    }
    
    getLShipDirection() {
        let direction = 'TOP-RIGHT',
            value = Math.floor(Math.random()*8);
        switch(value) {
            case 0:
                direction = 'TOP-RIGHT';
                break;
            case 1:
                direction = 'TOP-LEFT'
                break;
            case 2:
                direction = 'BOTTOM-RIGHT'
                break;
            case 3:
                direction = 'BOTTOM-LEFT'
                break;
            case 4:
                direction = 'RIGHT-TOP'
                break;
            case 5:
                direction = 'RIGHT-BOTTOM'
                break;
            case 6:
                direction = 'LEFT-TOP'
                break;
            case 7:
                direction = 'LEFT-BOTTOM'
                break;
        }
        return direction;
    }
    
    getIShipFirstPosition() {
        let position = 1;
        switch(this.iShip.direction) {
            case 'VERTICAL':
                position = Math.floor(Math.random()*(70-1+1))+1;
                for(let i = 0; i < 4; i ++) {
                    let correction = Number(i)*10;
                    for (let condition of this.conditions) {
                        if(((position+correction) <= condition['max']) && ((position+correction) >= condition['min'])) {
                            return this.getIShipFirstPosition();
                        }
                    }
                }
                break;
            case 'HORIZONTAL':
                position = Math.floor(Math.random()*(97-1+1))+1;
                if(!((position+3)%10) || !((position+2)%10) || !((position+1)%10) || !(position%10)) {
                    return this.getIShipFirstPosition();
                }
                for(let i = 0; i < 4; i ++) {
                    let correction = Number(i);
                    for (let condition of this.conditions) {
                        if(((position+correction) <= condition['max']) && ((position+correction) >= condition['min'])) {
                            return this.getIShipFirstPosition();
                        }
                    }
                }
                break;
        }
        return position;
    }
    
    getLShipFirstPosition() {
        let badPosition = false,
            position = 12;
        switch (this.lShip.direction) {
            case 'TOP-RIGHT':
                position = Math.floor(Math.random()*(79-1+1))+1;
                if(!(position%10)) {
                    badPosition = true;
                }
                break;
            case 'TOP-LEFT':
                position = Math.floor(Math.random()*(80-1+1))+1;
                if(!((position-1)%10)) {
                    badPosition = true;
                }
                break;
            case 'BOTTOM-RIGHT':
                position = Math.floor(Math.random()*(99-21+1))+21;
                if(!(position%10)) {
                    badPosition = true;
                }
                break;
            case 'BOTTOM-LEFT':
                position = Math.floor(Math.random()*(100-22+1))+22;
                if(!((position-1)%10)) {
                    badPosition = true;
                }
                break;
            case 'RIGHT-TOP':
                position = Math.floor(Math.random()*(100-13+1))+13;
                if(!((position-2)%10) || !((position-1)%10)) {
                    badPosition = true;
                }
                break;
            case 'RIGHT-BOTTOM':
                position = Math.floor(Math.random()*(90-3+1))+3;
                if(!((position-2)%10) || !((position-1)%10)) {
                    badPosition = true;
                }
                break;
            case 'LEFT-TOP':
                position = Math.floor(Math.random()*(98-11+1))+11;
                if(!((position+2)%10) || !((position+1)%10) || !(position%10)) {
                    badPosition = true;
                }
                break;
            case 'LEFT-BOTTOM':
                position = Math.floor(Math.random()*(88-1+1))+1;
                if(!((position+2)%10) || !((position+1)%10) || !(position%10)) {
                    badPosition = true;
                }
                break;
        }
        if (badPosition) {
            position = this.getLShipFirstPosition();
        }
        return position;
    }
    
    shot() {
        let newShot = Math.floor(Math.random()*(100-1+1))+1;
        for (let shot of this.shots) {
            if(shot == newShot) {
                this.shot();
                return;
            }
        }
        this.board[(Math.floor((newShot-1)/10))][(newShot-1)%10]['shooted'] = true;
        if(this.board[(Math.floor((newShot-1)/10))][(newShot-1)%10]['ship']) {
            this.shootedShips ++;
        }
        this.shots.push(newShot);
    }
    
    startGame() {
        if (this.firstStart) {
            this.firstStart = false;
        }
        this.board = [];
        this.conditions = [];
        this.dotShapedShips = [];
        this.iShip = null;
        this.lShip = null;
        this.shootedShips = 0;
        this.shots = [];
        this.createBoard();
        this.createLShip();
        for (let element in this.lShip) {
            if(element != 'direction') {
                this.addConditions(this.lShip[element]);
            }
        }
        this.createIShip();
        for (let element in this.iShip) {
            if(element != 'direction') {
                this.addConditions(this.iShip[element]);
            }
        }
        this.createDotShapedShips();
        this.fillBoard();
    }
}
