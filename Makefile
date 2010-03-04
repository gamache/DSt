YUIC=java -jar ~/yuic/yuicompressor-2.4.2.jar --type js

all: minified

minified: jquery dst

jquery:
	sed -e 's/^var DSt/jQuery.DSt/' <src/DSt.js | $(YUIC) >jQuery.DSt.js

dst:
	$(YUIC) src/DSt.js > DSt.js


