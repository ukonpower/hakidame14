import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import fluidCrystalFrag from './shaders/fluidCrystal.fs';
import fluidCrystalVert from './shaders/fluidCrystal.vs';

export class FluidCrystal extends MXP.Component {

	private material: MXP.Material;

	constructor() {

		super();

		this.material = new MXP.Material( {
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/fluidCrystal.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'fluidCrystal', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/fluidCrystal.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'fluidCrystal', module.default );

					this.material.requestUpdate();

				}


			} );

		}

	}

	public setEntity( entity: MXP.Entity ): void {
	}

}
