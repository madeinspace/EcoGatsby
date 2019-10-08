# Word Renderer

If you're in here, then you have my condolences.

This is the result of some brain-wracking stuff, involving understanding `react-reconciler` (for building React renderers) and the `docx` library, so that I might be able to render Word Documents, using React, within a browser.

## Prior Art

There have been other libraries that have attempted to do word doc rendering in javascript, but inevitably none of them were suited to rendering word-docs _in the browser_.

#### redocx

`redocx` looked good from the outset; a nice react interface, produced a word doc at the end.

Unfortunately, it very quickly presented some problems;

1. It depended upon, and directly executed, `execa`, a tool used for executing binaries on a filesystem; The purpose of this was once you generated the document, it would open it in Word for you. Completely dependent upon being run on a desktop, not compatible with the browser.
2. `Officegen`. On the face of things, this seemed fine. It was even a more feature-ful toolkit, capable of building Word files, but also Excel and Powerpoint files, all with pure Javascript. Sounds great! But with one fatal flaw: This library, too, assumed filesystem access (the nodejs `fs` library), and no amount of memfs/fs-monkey hackery seemed to help solve this problem. I'm sure with more time spent on the problem this could be solved, so that we might use streams, or even just get a blob out at the other end, but for now this was a deadend.

## Not complete

This is not a complete tool for rendering word documents. `docx`, the underlying library, is itself complete (as far as I am aware, at least). This has only been completed for the narrow usecase we had, at least as far in as proving out that we could actually succeed in producing a word document in the browser.

Most notably, you will find that tables are practically missing at the moment, however they are completely achievable with `docx`.