package {
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.text.TextField;
	import com.yahoo.util.YUIBridge;
	
	public class Simple extends Sprite {
		
		public var txt:TextField = new TextField();
		public var yuiBridge:YUIBridge;
		function Simple () {
			yuiBridge = new YUIBridge(this.stage);
			this.graphics.beginFill(0xFFCC00);
			this.graphics.drawCircle(200,200,50);
			this.graphics.endFill();
			
			txt.width = 400;
			txt.height = 200;
			this.addChild(txt);
			this.addText("Initializing...");
			yuiBridge.addCallbacks ({addText:addText});
		}
		
		public function addText(someText:String) : void {
			txt.appendText(someText);
			yuiBridge.sendEvent({type:"textAdded", text:someText});
		}
		
		
	}
	
	
}