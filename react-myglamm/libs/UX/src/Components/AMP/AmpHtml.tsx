import parse, { domToReact } from "html-react-parser";

export default function AmpHtml({ html }: any) {
  return (
    <>
      <h3>About this service</h3>
      {parse(html || "")}
    </>
  );
}
