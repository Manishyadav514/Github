interface taxPropsType {
  taxTitle: string;
  taxCount: number;
  customClass?: any;
  clicked: (isClick: boolean) => boolean;
}

export function TaxGroup({
  taxTitle,
  taxCount,
  customClass,
  clicked,
}: taxPropsType) {
  return (
    <>
      <div
        class="p-5 w-80 border border-solid border-slate-200 inline-flex items-start cursor-pointer"
        onClick={() => {
          clicked(true);
        }}
      >
        <img src="/images/svg/folder.svg" alt="folder" />
        <div class="ml-4">
          <h6 class="mb-2 w-56 text-base font-semibold truncate text-black">
            {taxTitle}
          </h6>
          <p class="text-sm	text-slate-400">{taxCount} Tax</p>
        </div>
      </div>
    </>
  );
}
