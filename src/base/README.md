Base
====

Base is designed to be a low level class from which other attribute 
and event target based classes in the YUI library can be derived. 
It provides a standard template for creating attribute based objects 
across the library and provides a consistent init() and destroy() 
sequence, by chaining initialization (initializer) and destruction 
(destructor) methods for the class hierarchy.