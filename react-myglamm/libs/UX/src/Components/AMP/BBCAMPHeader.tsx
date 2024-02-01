import AMPSideBar from "./AMPSideBar";

export default function BBCAMPHeader() {
  //
  return (
    <>
      <header>
        <h1>
          {/* @ts-ignore */}
          <button className="hamburger" on="tap:sidebar.toggle" />
          <a href="https://www.babychakra.com/" aria-label="BBC logo">
            <amp-img
              height="32"
              width="200"
              src="https://files.babychakra.com/site-images/original/new-bbc-logo.png"
              alt="BabyChakra"
              layout="fixed"
            />
          </a>
        </h1>
        <AMPSideBar />
      </header>
    </>
  );
}
