# Overview

Short for 'File Lover', Flover is a open solution to archive/backup files of any kind (though it is biased toward binary-like files and doesn't contain a mechanism to only store differentials so constantly evolving text files, like code for example, are best stored in a version control system like Git)

The core idea is to decouple the components of a file storage solution (backend API, storage plugin, model, client), provide a clear contract between components and enough flexibility that various kinds of files can be stored.

This repo will contain the javascript model and the specs for the contracts between the components.

As I'm currently implementing an API backend for it with Express and a storage plugin with MongoDB/GridFS. Until I have a fully working implementation, consider this repository a work in progress.

# Model

The model for Flover has 2 entities:
- Files: Self-descriptive
- Files Groups: A logical grouping of associated files (could be the songs of an album, the various formats of an ebook, whatever grouping makes sense really)

## Design Notes

Ramda lenses are used by the model and all setters in the model respect the rules of immutability (meaning that they don't modify data structures inplace, but rather return a copy of the passed data structure with the changes applied to it).

Also, there are no constructors. You can always start with an empty object (ie, {}) and compose the various setters of the model to obtain a fully populated data structure. Also note that not all properties in the models are mandatory (the mandatory properties are dictated by the API endpoint you are calling).

Many of the data types you can pass to the model (for example, ids) are deliberately flexible in order not to discriminate against a particular storage or API solution.

When you define values to pass to the model, you should stick with native js types (no classes) in order to keep the data easily serializable in JSON. If you need a class for a particular component (ex: MongoDB ObjectID for a MongoDB storage plugin), you should apply a translation layer at the boundary of that component in order to keep the usage of the class scoped to that component.

## File

The file model contains the following functions:

```
getId(file)
setId(id, file)
overId(fn, file)
```

These functions get, set or apply a custom function over the file's id. The id should be a unique identifier for the file.

```
getMetadata(file)
setMetadata(metadata, file)
overMetadata(fn, file)
```

These functions get, set or apply a custom function over the file's metadata. The metadata should be an object containing various properties of the file.

The exact structure of the object is up to the user, with the caveat that it should be compatible with the storage plugin that is used. A flat set of key-values is recommended for maximum compatibility.

```
getTitle(file)
setTitle(title, file)
overTitle(fn, file)
```

These functions get, set or apply a custom function over the file's title. Note that if the file's title is not defined, but the file's id is defined, the id will be returned by the getter instead.

```
getContent(file)
setContent(content, file)
overContent(fn, file)
```

These functions get, set or apply a custom function over the file's content.

There is no enforced format on the file's content. A stream probably makes the most sense for any sizeable file, although it is not directly serializable in json.

```
getMimeType(file)
setMimeType(mimeType, file)
overMimeType(fn, file)
```

These functions get, set or apply a custom function over the file's mime type.

```
getEncoding(file)
setEncoding(encoding, file)
overEncoding(fn, file)
```

These functions get, set or apply a custom function over the file's encoding.

```
getMd5(file)
setMd5(md5, file)
overMd5(fn, file)
```

These functions get, set or apply a custom function over the file's md5 checkum.

```
getGroup(file)
setGroup(groupId, file)
overGroup(fn, file)
```

These functions get, set or apply a custom function over the file's group. Note that this value should be an id that uniquely identifies the file's group.

In practice, you should never have to call the setter as it is automatically called for you when you add an array of files to a files group.

## Files Group

```
getId(filesGroup)
setId(filesGroup)
overId(fn, filesGroup)
```

These functions get, set or apply a custom function over the files group's id. The id should be a unique identifier for the file.

Note that the setters will propagate the group's id change to all of its files (calling **setGroup** on all the files).

```
getMatchOn(filesGroup)
setMatchOn(matchOn, filesGroup)
overMatchOn(fn, filesGroup)
```

The function get, set or apply a function on the match criteria that identifies other groups of files that are a replicate of this group.

This should be an array of string values which will map to keys in the metadata.

This is an application-dependant configuration used to match same pre-existing groups of files when inserting a new one. It should not be persisted with the rest of the group information in the store.

```
getDuplicationThreshold(filesGroup)
setDuplicationThreshold(duplicationThreshold, filesGroup)
overDuplicationThreshold(fn, filesGroup)
```

The function get, set or apply a function on the threshold dictating on many duplicate versions of the same group of file that should be persisted. It should be an integer.

This is an application-dependant configuration used when inserting a new group. It should not be persisted with the rest of the group information in the store.

```
getMetadata(filesGroup)
setMetadata(metadata, filesGroup)
overMetadata(fn, filesGroup)
```

The function get, set or apply a function on the metadata information of the group. 

The metadata of the group should be an object of flat key/value pairs. If you also to support storing multiple versions of the same files group in your app, a subset of the keys you store in the metadata should also uniquely identify the group.

```
getTimestamp(filesGroup)
setTimestamp(timestamp, filesGroup)
overTimestamp(fn, filesGroup)
```

The function get, set or apply a function on the group's timestamp. This group timestamp should be used when multiple versions of the same group are stored to determine version order.

There is no specified format for the timestamp (iso is recommended, but not enforced) beyond the fact that it should be a string in order to be json serializable.

```
getFiles(filesGroup)
setFiles(files, filesGroup)
overFiles(fn, filesGroup)
```

The function get, set or apply a function on the group's files. This should be an array of file structures populated with methods from the **File** model.

Note that the setters will automatically populate the files with the group's id, calling the **setGroup** method on the files.