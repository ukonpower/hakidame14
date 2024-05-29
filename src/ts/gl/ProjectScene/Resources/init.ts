import * as MXP from 'maxpower';


import { BLidgeClient } from "./Components/BLidgeClient";
import { FluidCrystal } from './Components/FluidCrystal';
import { LookAt } from "./Components/LookAt";
import { Music } from './Components/Music';
import { OrbitControls } from './Components/OrbitControls';
import { ShakeViewer } from "./Components/ShakeViewer";
import { SkyBox } from "./Components/SkyBox";
import { TemplateComponent } from './Components/TemplateComponent';
import { TurnTable } from './Components/TurnTable';
import { VJCamera } from './Components/VJCamera';
import { OREngineCube } from './Materials/OREngineCube';
import { OREngineLogo } from './Materials/OREngineLogo';

import { resource } from "~/ts/Globals";

export const initResouces = () => {

	/*-------------------------------
		Components
	-------------------------------*/

	resource.clearComponents();

	// object

	const comObject = resource.componentCategory( "Object" );

	comObject.register( "camera", MXP.Camera, {
		cameraType: "perspective",
	} );

	comObject.register( "light", MXP.Light, {
		lightType: "directional",
	} );

	// geometry

	const comGeometry = resource.componentCategory( "Geometry" );

	comGeometry.register( "geometry", MXP.SphereGeometry, {
		radius: 0.5,
		widthSegments: 20,
		heightSegments: 10,
	} );

	comGeometry.register( "geometry", MXP.CubeGeometry, {
		width: 1,
		height: 1,
		depth: 1,
	} );

	comGeometry.register( "geometry", MXP.CylinderGeometry, {
		radiusTop: 0.5,
		radiusBottom: 0.5,
		height: 1,
		radSegments: 10,
		heightSegments: 1
	} );

	// material

	const comMaterial = resource.componentCategory( "Material" );

	comMaterial.register( "material", MXP.Material );
	comMaterial.register( "material", OREngineLogo );
	comMaterial.register( "material", OREngineCube );

	// controls

	const comView = resource.componentCategory( "Controls" );

	comView.register( "lookAt", LookAt );

	comView.register( "shakeViewer", ShakeViewer, {
		power: 1.0,
		speed: 1.0
	} );

	comView.register( "orbitControls", OrbitControls );

	comView.register( "vjCamera", VJCamera );

	comView.register( "turntable", TurnTable );

	// entity

	const comEntity = resource.componentCategory( "Entity" );

	comEntity.register( "SkyBox", SkyBox );

	comEntity.register( "FluidCrystal", FluidCrystal );

	comEntity.register( "Template", TemplateComponent );


	// Other

	const comOther = resource.componentCategory( "Other" );

	comOther.register( "blidgeClient", BLidgeClient );
	comOther.register( "music", Music );


};
