import { Injectable } from '@angular/core';

@Injectable()
export class StepGeneratorService {
    onStep(step) {
        console.log( step )
    }
}