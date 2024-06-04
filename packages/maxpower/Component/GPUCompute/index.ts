import * as GLP from 'glpower';

import { GPUComputePass } from '../GPUComputePass';
import { PostProcess, PostProcessParam } from '../PostProcess';

export interface GPUComputeParam extends PostProcessParam{
	input?: GLP.GLPowerTexture[];
	passes: GPUComputePass[];
} 

export class GPUCompute extends PostProcess {
	

	constructor( param: GPUComputeParam ) {

		super( param );

	}

	public get key(): string {
		
		return 'gpuCompute';
	}

}
