
// fetch("https://test-wemed.herokuapp.com/session")
// .then(data => data.json())
// .then(data => console.log(data))

const apiKey = 47478071;
const sessionId = "1_MX40NzQ3ODA3MX5-MTY1MDQ0MzI4ODkxMH5lTjRTR2ttbFZQZGVNdFkrQmxVRUtrSkZ-fg";
const token = "T1==cGFydG5lcl9pZD00NzQ3ODA3MSZzaWc9OGJkOGYzNmQ0ZGYyNTJkNGJkYTdjNTBkMWRjYjdmZDI5YmUyMjY0MjpzZXNzaW9uX2lkPTFfTVg0ME56UTNPREEzTVg1LU1UWTFNRFEwTXpJNE9Ea3hNSDVsVGpSVFIydHRiRlpRWkdWTmRGa3JRbXhWUlV0clNrWi1mZyZjcmVhdGVfdGltZT0xNjUwNDQ0MjIxJnJvbGU9cHVibGlzaGVyJm5vbmNlPTE2NTA0NDQyMjEuMjg0MzgyNDE2MzY5NyZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ=="



let test = new Skop.Skop(sessionId, token, apiKey, true, true, "Aortic");


