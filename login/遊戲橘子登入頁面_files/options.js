fb.proto.globalOptions = {
// **********************************************
// EDIT ONLY WITHIN THE FOUR OPTION BLOCKS BELOW.
// See the instructions for information about setting floatbox options.
// See the options reference for details about all the available options.
// Commas are required after each entry except the last entry in a block.
// A comma on the last entry in a block will cause the option settings to fail.

// globalOptions is where you enter a license key and change default floatbox options site-wide.
// Use the configurator.html form in this folder to generate globalOptions preferences through form selections.

globalOptions: {
    licenseKey: "Fw7tIArdFhTZGwTtFw7iKgrd6R@ZGwDZFw7hFgrdHQnZGwDXFw7jHwrdIATZGx3jFw7XGep",
    showIE6EndOfLife: false,
    color: "custom",
    cornerRadius: 8,
    shadowSize: 8,
    captionPos: "tl",
    controlsPos: "tr",
    padding: 18,
    autoFitOther: true,
    doAnimations: false,
    outsideClickCloses: false,
    enableDragMove: false,
    language: "en"
},
// overlayOpacity: 95		// 1 ~ 100

// childOptions are preferences to be applied only to secondary floatboxes.
// Additional options can be added to this list,
// or remove an option to have it revert to the default or global setting.

childOptions: {
  cornerRadius: 8,
  shadowSize: 8,
  padding: 16,
  overlayOpacity: 45,
  resizeDuration: 3,
  imageFadeDuration: 3,
  overlayFadeDuration: 0
},

// Option settings can be assigned based on floatbox content type.
// The syntax of typeOptions is different than the object code above.
// Each type is assigned an option string formatted the same as
// the options placed in a link's data-fb-options (or rev) attribute.
// example - iframe: "color:blue showNewWindow:true",

typeOptions: {
    image: "color:custom",
  img: "color:custom",
  // html settings apply to the 4 html sub-types that follow
  html: "color:custom",
    iframe: "",
    inline: "",
    ajax: "",
    direct: "",
  // media settings apply to the 5 media sub-types that follow
    media: "color:custom",
    flash: "",
    quicktime: "",
    wmp: "",
    silverlight: "",
    pdf: "",
  // tooltip settings can consist of tooltip-specific options in addition to the standard floatbox options
  tooltip: ""   
},

// You can propogate settings to groups of anchors by assigning them a class
// and associating that class name with a string of options here.
// The syntax is the same as for typeOptions above.

classOptions: {
},

// END OF EDITABLE CONTENT
// ***********************
optionsLoaded: true };
