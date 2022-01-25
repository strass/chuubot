import { Store } from "n3";
import invariant from "tiny-invariant";
import { iris } from "../../../__schema.js";
import CustomQuad from "../../CustomQuad.js";
import store from "../../store.js";

export default function createDiscordEmbed(shapedClass: CustomQuad) {
  const [titlePropertySubjectQuery] = shapedClass.shape.getSubjects(
    iris.discord.component,
    iris.discord.embedTitle,
    null
  );
  const [titleProperty] = shapedClass.shape.getObjects(
    titlePropertySubjectQuery,
    iris.sh.path,
    null
  );

  // Find all of the subjects which are tagged as being in the embed description
  const titlePropertyDescriptionQuery = shapedClass.shape.getSubjects(
    iris.discord.component,
    iris.discord.embedDescription,
    null
  );
  // Expand the subjects into groups of quads for each path
  const descriptionFields = titlePropertyDescriptionQuery.reduce(
    (acc, subject) => [
      ...acc,
      new Store(shapedClass.shape.getQuads(subject, null, null, null)),
    ],
    [] as Store[]
  );
  // Order the fields
  const orderedDescriptionFields = descriptionFields.sort((a, b) => {
    const aOrder = Number(
      a.getObjects(null, iris.sh.order, null)[0]?.value ?? -1
    );
    const bOrder = Number(
      b.getObjects(null, iris.sh.order, null)[0]?.value ?? -1
    );
    return aOrder - bOrder;
  });

  const title =
    shapedClass.get(titleProperty.value ?? iris.rdfs.label)[0] ??
    shapedClass.subject.id;

  const description = orderedDescriptionFields.reduce((acc, curr, idx, arr) => {
    let text = "";

    // If there is a title, add it
    const [name] = curr.getObjects(null, iris.sh.name, null);
    const [skipTitle] = curr.getObjects(
      null,
      iris.discord.embedSkipLabel,
      null
    );
    if (name && !skipTitle) {
      text = text + `**${name.value}:** `;
    }

    // Get the field by path
    const [path] = curr.getObjects(null, iris.sh.path, null);
    invariant(path, "No path found for description field");
    let quads = shapedClass.getQuads(path.value);

    let values = quads.flatMap((quad) =>
      // Literals should be used directly, other items should look up the object's label first
      quad.object.termType === "Literal"
        ? quad.object.value
        : store.getLabel(quad.object)
    );

    if (values.length > 1) {
      values = ["\n" + values.map((v) => `- ${v}`).join("\n")];
    }
    text = text + values + (skipTitle ? " " : "");

    // If the next item is in the same group, don't add a new line
    const [group] = curr.getObjects(null, iris.sh.group, null);
    const next = arr[idx + 1];
    const [nextGroup] = next ? next.getObjects(null, iris.sh.group, null) : [];
    if (!group || !nextGroup || nextGroup.value !== group.value) {
      text = text + "\n";
    }

    return `${acc}${text}`;
  }, "");

  return { title, description };
}
