XML
========

The XML Utility provides a functionality to parse XML data into known
JavaScript entities, as well as convert such entities into formatted strings.

Known Issues
------------
   * In IE10 WebView, XML parsing produces an object that does not allow accessing elements via XPath.
     This is due to the fact that IE10 WebView restricts access to both the XMLDocument ActiveX control
     and the new WinJS XMLDocument API.
