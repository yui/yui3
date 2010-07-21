
function SWFButton (config) 
{
	SWFButton.superclass.constructor.apply(this, arguments);
}

SWFButton.NAME = "swfButton";

/**
 * Need to refactor to augment Attribute
 */
Y.extend(SWFButton, Y.SWFWidget, 
{
	GUID:"yuiswfButton",

	/**
	 * Reference to corresponding Actionscript class.
	 */
	AS_CLASS: "Button"
});

Y.SWFButton = SWFButton;
