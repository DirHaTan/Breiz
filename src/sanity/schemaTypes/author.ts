import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author / Skrivagner",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
  ],
});
