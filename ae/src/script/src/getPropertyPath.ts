import { getActiveComp } from "../utils/aeft-utils";

const propCompactEnglishExpressions = {
  "ADBE Transform Group": () => "transform",
  // Handle camera/light vs. AV layers
  "ADBE Anchor Point": (prop: Property | PropertyGroup) =>
    prop.propertyGroup(prop.propertyDepth).property("intensity") != null ||
    prop.propertyGroup(prop.propertyDepth).property("zoom") != null
      ? ".pointOfInterest"
      : ".anchorPoint",
  "ADBE Position": () => ".position",
  "ADBE Scale": () => ".scale",
  "ADBE Orientation": () => ".orientation",
  "ADBE Rotate X": () => ".xRotation",
  "ADBE Rotate Y": () => ".yRotation",
  // Handle 3D vs. 2D layers
  "ADBE Rotate Z": (prop: Property | PropertyGroup) =>
    prop.propertyGroup(prop.propertyDepth).property("threeDLayer") ||
    prop.propertyGroup(prop.propertyDepth).property("intensity") != null ||
    prop.propertyGroup(prop.propertyDepth).property("zoom") != null
      ? ".zRotation"
      : ".rotation",
  "ADBE Opacity": () => ".opacity",
  "ADBE Material Options Group": () => "materialOption",
  "ADBE Casts Shadows": () => ".castsShadows",
  "ADBE Light Transmission": () => ".lightTransmission",
  "ADBE Accepts Shadows": () => ".acceptsShadows",
  "ADBE Accepts Lights": () => ".acceptsLights",
  "ADBE Ambient Coefficient": () => ".ambient",
  "ADBE Diffuse Coefficient": () => ".diffuse",
  "ADBE Specular Coefficient": () => ".specular",
  "ADBE Shininess Coefficient": () => ".shininess",
  "ADBE Metal Coefficient": () => ".metal",

  "ADBE Light Options Group": () => "lightOption",
  "ADBE Light Intensity": () => ".intensity",
  "ADBE Light Color": () => ".color",
  "ADBE Light Cone Angle": () => ".coneAngle",
  "ADBE Light Cone Feather 2": () => ".coneFeather",
  //"ADBE Casts Shadows": () =>                                     ".castsShadows",  // Already covered previously
  "ADBE Light Shadow Darkness": () => ".shadowDarkness",
  "ADBE Light Shadow Diffusion": () => ".shadowDiffusion",

  "ADBE Camera Options Group": () => "cameraOption",
  "ADBE Camera Zoom": () => ".zoom",
  "ADBE Camera Depth of Field": () => ".depthOfField",
  "ADBE Camera Focus Distance": () => ".focusDistance",
  "ADBE Camera Aperture": () => ".aperture",
  "ADBE Camera Blur Level": () => ".blurLevel",

  "ADBE Text Properties": () => "text",
  "ADBE Text Document": () => ".sourceText",
  "ADBE Text Path Options": () => ".pathOption",
  "ADBE Text Path": () => ".path",
  "ADBE Text Reverse Path": () => ".reversePath",
  "ADBE Text Perpendicular To Path": () => ".perpendicularToPath",
  "ADBE Text Force Align Path": () => ".forceAlignment",
  "ADBE Text First Margin": () => ".firstMargin",
  "ADBE Text Last Margin": () => ".lastMargin",
  "ADBE Text More Options": () => ".moreOption",
  "ADBE Text Anchor Point Option": () => ".anchorPointGrouping",
  "ADBE Text Anchor Point Align": () => ".groupingAlignment",
  "ADBE Text Render Order": () => ".fillANdStroke",
  "ADBE Text Character Blend Mode": () => ".interCharacterBlending",

  "ADBE Text Animators": () => ".animator",
  //"ADBE Text Animator": () =>                                     "",       // No equivalent
  "ADBE Text Selectors": () => ".selector",
  //"ADBE Text Selector": () =>                                         "",       // No equivalent
  "ADBE Text Percent Start": () => ".start",
  "ADBE Text Percent End": () => ".end",
  "ADBE Text Percent Offset": () => ".offset",
  "ADBE Text Index Start": () => ".start",
  "ADBE Text Index End": () => ".end",
  "ADBE Text Index Offset": () => ".offset",
  "ADBE Text Range Advanced": () => ".advanced",
  "ADBE Text Range Units": () => ".units",
  "ADBE Text Range Type2": () => ".basedOn",
  "ADBE Text Selector Mode": () => ".mode",
  "ADBE Text Selector Max Amount": () => ".amount",
  "ADBE Text Range Shape": () => ".shape",
  "ADBE Text Selector Smoothness": () => ".smoothness",
  "ADBE Text Levels Max Ease": () => ".easeHigh",
  "ADBE Text Levels Min Ease": () => ".easeLow",
  "ADBE Text Randomize Order": () => ".randomizeOrder",
  "ADBE Text Random Seed": () => ".randomSeed",
  //"ADBE Text Wiggly Selector": () =>                              "",       // No equivalent
  "ADBE Text Wiggly Max Amount": () => ".maxAmount",
  "ADBE Text Wiggly Min Amount": () => ".minAmount",
  "ADBE Text Temporal Freq": () => ".wigglesSecond",
  "ADBE Text Character Correlation": () => ".correlation",
  "ADBE Text Temporal Phase": () => ".temporalPhase",
  "ADBE Text Spatial Phase": () => ".spatialPhase",
  "ADBE Text Wiggly Lock Dim": () => ".lockDimensions",
  "ADBE Text Wiggly Random Seed": () => ".randomSeed",
  //"ADBE Text Expressible Selector": () =>                     "",       // No equivalent
  "ADBE Text Expressible Amount": () => ".amount",
  "ADBE Text Animator Properties": () => ".property",
  "ADBE Text Anchor Point 3D": () => ".anchorPoint",
  "ADBE Text Position 3D": () => ".position",
  "ADBE Text Scale 3D": () => ".scale",
  "ADBE Text Skew": () => ".skew",
  "ADBE Text Skew Axis": () => ".skewAxis",
  "ADBE Text Rotation X": () => ".xRotation",
  "ADBE Text Rotation Y": () => ".yRotation",
  "ADBE Text Rotation": () => ".zRotation",
  "ADBE Text Opacity": () => ".opacity",
  "ADBE Text Fill Opacity": () => ".fillOpacity",
  "ADBE Text Fill Color": () => ".fillColor",
  "ADBE Text Fill Hue": () => ".fillHue",
  "ADBE Text Fill Saturation": () => ".fillSaturation",
  "ADBE Text Fill Brightness": () => ".fillBrightness",
  "ADBE Text Stroke Opacity": () => ".strokeOpacity",
  "ADBE Text Stroke Color": () => ".strokeColor",
  "ADBE Text Stroke Hue": () => ".strokeHue",
  "ADBE Text Stroke Saturation": () => ".strokeSaturation",
  "ADBE Text Stroke Brightness": () => ".strokeBrightness",
  "ADBE Text Stroke Width": () => ".strokeWidth",
  "ADBE Text Line Anchor": () => ".lineAnchor",
  "ADBE Text Line Spacing": () => ".lineSpacing",
  "ADBE Text Track Type": () => ".trackingType",
  "ADBE Text Tracking Amount": () => ".trackingAmount",
  "ADBE Text Character Change Type": () => ".characterAlignment",
  "ADBE Text Character Range": () => ".characterRange",
  "ADBE Text Character Replace": () => ".characterValue",
  "ADBE Text Character Offset": () => ".characterOffset",
  "ADBE Text Blur": () => ".blur",

  "ADBE Mask Parade": () => "mask",
  "ADBE Mask Shape": () => ".maskPath",
  "ADBE Mask Feather": () => ".maskFeather",
  "ADBE Mask Opacity": () => ".maskOpacity",
  "ADBE Mask Offset": () => ".maskExpansion",

  "ADBE Effect Parade": () => "effect",

  //"ADBE Paint": () =>                                                 "",
  //"ADBE Paint On Transparent": () =>                              "",
  "ADBE Paint Group": () => ".stroke",
  //"ADBE Paint Atom": () =>                                            "",
  //"ADBE Paint Transfer Mode": () =>                               "",
  //"ADBE Paint Duration": () =>                                        "",
  "ADBE Paint Shape": () => ".path",
  "ADBE Paint Properties": () => ".strokeOption",
  "ADBE Paint Begin": () => ".start",
  "ADBE Paint End": () => ".end",
  "ADBE Paint Color": () => ".color",
  "ADBE Paint Diameter": () => ".diameter",
  "ADBE Paint Angle": () => ".angle",
  "ADBE Paint Hardness": () => ".hardness",
  "ADBE Paint Roundness": () => ".roundness",
  "ADBE Paint Tip Spacing": () => ".spacing",
  "ADBE Paint Target Channels": () => ".channels",
  "ADBE Paint Opacity": () => ".opacity",
  "ADBE Paint Flow": () => ".flow",
  "ADBE Paint Clone Layer": () => ".cloneSource",
  "ADBE Paint Clone Position": () => ".clonePosition",
  "ADBE Paint Clone Time": () => ".cloneTime",
  "ADBE Paint Clone Time Shift": () => ".cloneTimeShift",
  //"ADBE Paint Clone Source Type": () =>                           "",
  "ADBE Paint Transform": () => ".transform",
  "ADBE Paint Anchor Point": () => ".anchorPoint",
  "ADBE Paint Position": () => ".position",
  "ADBE Paint Scale": () => ".scale",
  "ADBE Paint Rotation": () => ".rotation",
  //"ADBE Paint Nibbler Group": () =>                               "",

  "ADBE MTrackers": () => "motionTracker",
  "ADBE MTracker Pt Feature Center": () => ".featureCenter",
  "ADBE MTracker Pt Feature Size": () => ".featureSize",
  "ADBE MTracker Pt Search Ofst": () => ".searchOffset",
  "ADBE MTracker Pt Search Size": () => ".searchSize",
  "ADBE MTracker Pt Confidence": () => ".confidence",
  "ADBE MTracker Pt Attach Pt": () => ".attachPoint",
  "ADBE MTracker Pt Attach Pt Ofst": () => ".attachPointOffset",

  "ADBE Audio Group": () => "audio",
  "ADBE Audio Levels": () => ".audioLevels",

  "ADBE Time Remapping": () => "timeRemap",

  "ADBE Layer Styles": () => "layerStyle",
  "ADBE Blend Options Group": () => ".blendingOption",
  "ADBE Global Angle2": () => ".globalLightAngle",
  "ADBE Global Altitude2": () => ".globalLightAltitude",
  "ADBE Adv Blend Group": () => ".advancedBlending",
  "ADBE Layer Fill Opacity2": () => ".fillOpacity",
  "ADBE R Channel Blend": () => ".red",
  "ADBE G Channel Blend": () => ".green",
  "ADBE B Channel Blend": () => ".blue",
  "ADBE Blend Interior": () => ".blendInteriorStylesAsGroup",
  "ADBE Blend Ranges": () => ".useBlendRangesFromSource",

  "ADBE Vector Trim Offset": () => ".offset",
  "ADBE Vector Filter - Trim": (prop: PropertyGroup) =>
    `content("${prop.name}")`,
  "ADBE Vectors Group": (prop: PropertyGroup) => `content("${prop.name}")`,
  "ADBE Vector Group": (prop: PropertyGroup) => `content("${prop.name}")`,

  "dropShadow/enabled": () => ".dropShadow",
  "dropShadow/mode2": () => ".blendMode",
  "dropShadow/color": () => ".color",
  "dropShadow/opacity": () => ".opacity",
  "dropShadow/useGlobalAngle": () => ".useGlobalLight",
  "dropShadow/localLightingAngle": () => ".angle",
  "dropShadow/distance": () => ".distance",
  "dropShadow/chokeMatte": () => ".spread",
  "dropShadow/blur": () => ".size",
  "dropShadow/noise": () => ".noise",
  "dropShadow/layerConceals": () => ".layerKnocksOutDropShadow",
  "innerShadow/enabled": () => ".innerShadow",
  "innerShadow/mode2": () => ".blendMode",
  "innerShadow/color": () => ".color",
  "innerShadow/opacity": () => ".opacity",
  "innerShadow/useGlobalAngle": () => ".useGlobalLight",
  "innerShadow/localLightingAngle": () => ".angle",
  "innerShadow/distance": () => ".distance",
  "innerShadow/chokeMatte": () => ".choke",
  "innerShadow/blur": () => ".size",
  "innerShadow/noise": () => ".noise",
  "outerGlow/enabled": () => ".outerGlow",
  "outerGlow/mode2": () => ".blendMode",
  "outerGlow/opacity": () => ".opacity",
  "outerGlow/noise": () => ".noise",
  "outerGlow/AEColorChoice": () => ".colorType",
  "outerGlow/color": () => ".color",
  //"outerGlow/gradient": () =>                                         ".",      // No equivalent
  "outerGlow/gradientSmoothness": () => ".gradientSmoothness",
  "outerGlow/glowTechnique": () => ".technique",
  "outerGlow/chokeMatte": () => ".spread",
  "outerGlow/blur": () => ".size",
  "outerGlow/inputRange": () => ".range",
  "outerGlow/shadingNoise": () => ".jitter",
  "innerGlow/enabled": () => ".innerGlow",
  "innerGlow/mode2": () => ".blendMode",
  "innerGlow/opacity": () => ".opacity",
  "innerGlow/noise": () => ".noise",
  "innerGlow/AEColorChoice": () => ".colorType",
  "innerGlow/color": () => ".color",
  //"innerGlow/gradient": () =>                                         ".",      // No equivalent
  "innerGlow/gradientSmoothness": () => ".gradientSmoothness",
  "innerGlow/glowTechnique": () => ".technique",
  "innerGlow/innerGlowSource": () => ".source",
  "innerGlow/chokeMatte": () => ".choke",
  "innerGlow/blur": () => ".size",
  "innerGlow/inputRange": () => ".range",
  "innerGlow/shadingNoise": () => ".jitter",
  "bevelEmboss/enabled": () => ".bevelAndEmboss",
  "bevelEmboss/bevelStyle": () => ".style",
  "bevelEmboss/bevelTechnique": () => ".technique",
  "bevelEmboss/strengthRatio": () => ".depth",
  "bevelEmboss/bevelDirection": () => ".direction",
  "bevelEmboss/blur": () => ".size",
  "bevelEmboss/softness": () => ".soften",
  "bevelEmboss/useGlobalAngle": () => ".useGlobalLight",
  "bevelEmboss/localLightingAngle": () => ".angle",
  "bevelEmboss/localLightingAltitude": () => ".altitude",
  "bevelEmboss/highlightMode": () => ".highlightMode",
  "bevelEmboss/highlightColor": () => ".highlightColor",
  "bevelEmboss/highlightOpacity": () => ".highlightOpacity",
  "bevelEmboss/shadowMode": () => ".shadowMode",
  "bevelEmboss/shadowColor": () => ".shadowColor",
  "bevelEmboss/shadowOpacity": () => ".shadowOpacity",
  "chromeFX/enabled": () => ".satin",
  "chromeFX/mode2": () => ".blendMode",
  "chromeFX/color": () => ".color",
  "chromeFX/opacity": () => ".opacity",
  "chromeFX/localLightingAngle": () => ".angle",
  "chromeFX/distance": () => ".distance",
  "chromeFX/blur": () => ".size",
  "chromeFX/invert": () => ".invert",
  "solidFill/enabled": () => ".colorOverlay",
  "solidFill/mode2": () => ".blendMode",
  "solidFill/color": () => ".color",
  "solidFill/opacity": () => ".opacity",
  "gradientFill/enabled": () => ".gradientOverlay",
  "gradientFill/mode2": () => ".blendMode",
  "gradientFill/opacity": () => ".opacity",
  //"gradientFill/gradient": () =>                                      ".",      // No equivalent
  "gradientFill/gradientSmoothness": () => ".gradientSmoothness",
  "gradientFill/angle": () => ".angle",
  "gradientFill/type": () => ".style",
  "gradientFill/reverse": () => ".reverse",
  "gradientFill/align": () => ".alignWithLayer",
  "gradientFill/scale": () => ".scale",
  "gradientFill/offset": () => ".offset",
  "patternFill/enabled": () => ".patternOverlay",
  "patternFill/mode2": () => ".blendMode",
  "patternFill/opacity": () => ".opacity",
  "patternFill/align": () => ".linkWithLayer",
  "patternFill/scale": () => ".scale",
  "patternFill/phase": () => ".offset",
  "frameFX/enabled": () => ".stroke",
  "frameFX/mode2": () => ".blendMode",
  "frameFX/color": () => ".color",
  "frameFX/size": () => ".size",
  "frameFX/opacity": () => ".opacity",
  "frameFX/style": () => ".position",
} as const;

const hasProp = <O extends object, K extends string | number | symbol>(
  obj: O,
  propKey: K
): obj is O & { [key in K]: unknown } => propKey in obj;

function getCompactEnglishExpression(
  prop: Property | PropertyGroup,
  matchName: string
) {
  if (!hasProp(propCompactEnglishExpressions, matchName)) {
    throw Error(
      `Couldn't get compact expression for property ${prop.name}\nMatch name: ${matchName}`
    );
  }

  const getTranslatedName = propCompactEnglishExpressions[matchName];

  return getTranslatedName(prop);
}

function getDeepestSelectedProp() {
  const comp = getActiveComp();
  let deepestProp,
    numDeepestProps = 0,
    deepestPropDepth = 0;
  let prop;

  for (var i = 0; i < comp.selectedProperties.length; i++) {
    prop = comp.selectedProperties[i];

    if (prop.propertyDepth >= deepestPropDepth) {
      if (prop.propertyDepth > deepestPropDepth) numDeepestProps = 0;
      deepestProp = prop;
      numDeepestProps++;
      deepestPropDepth = prop.propertyDepth;
    } else continue;
  }

  return numDeepestProps > 1 ? undefined : deepestProp;
}

function getLayerForProperty(property: Property | PropertyGroup) {
  return property.propertyGroup(property.propertyDepth);
}

export function getPropertyPath() {
  let currProp: Property | PropertyGroup | undefined = getDeepestSelectedProp();
  if (!currProp) return;

  const layer = getLayerForProperty(currProp);

  let exprCode = "";
  let compactName = "";

  while (currProp.parentProperty !== null) {
    compactName = getCompactEnglishExpression(currProp, currProp.matchName);
    exprCode = compactName + exprCode;

    // Traverse up the property tree
    currProp = currProp.parentProperty;
  }

  exprCode = `thisComp.layer("${layer.name}").${exprCode}`;
  return exprCode;
}
