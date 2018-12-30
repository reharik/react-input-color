all:
	babel lib --out-dir dist --verbose
	lessc lib/input-color.less > dist/input-color.css
	webpack -p
clean:
	rm dist/*
	rm example/bundle*
