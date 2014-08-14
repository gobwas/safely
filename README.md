# Safely

> Tool, that creates file names for safe rewriting of target file

## Getting started

Install with [npm](https://npmjs.org/package/safely)

```
npm install --save safely
```

## Example

```js
	safely("path/to/my/file.ext", function(err, filepath) {
	    // if given file is exists,
	    // filepath will be path/to/my/file(1).ext
	});
```

## API

### safely(filepath, [options], callback)

#### filepath

Type: `String`

Full path to the target file.
This is needed to be able to compare the current existing file (if any) with the destination file.

#### options

Type: `Object`

Then options object.

Property     | Necessary | Type       | Plugin default value
-------------|-----------|------------|---------------------
[format]     | no        | `String`   | `"%s(%d)%s"`
[version]    | no        | `Function` | `null`

#### options.format
Type: `String`
Default value: `"%s(%d)%s"`

The sprintf format of generated file name. Always have three placeholders - name, version, extension. Be careful with it, cause if you will do not use `%s` pattern inside it, your plugin can fall in infinite loop.

#### options.version
Type: `Function`
Return type: `Function`

Currying generator of file version. Return initialized generator, that will be called in each time, when file is already exists. Initialized generator takes one argument, that is callback, that resolved in standard node way - `callback(err, version)`, where version is a `String`:
```js

	safely("path/to/my/file", {
		version: function() {
			return function(done) {
				getSomeAsyncStuffWith(file)
					.then(function(result) {
						done(null, result);
					})
					.catch(done);
			}
		}
	}, done);

```