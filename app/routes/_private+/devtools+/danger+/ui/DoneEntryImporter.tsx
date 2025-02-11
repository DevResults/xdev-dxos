import { Button } from "~/ui/shadcn/button";
import { NO_OP } from "~/lib/constants";
import { useState } from "react";

export const DoneEntryImporter = ({ add = NO_OP, destroyAll = NO_OP, contacts = [] }: Props) => {
  const [importData, setImportData] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);
  const [doneEntries, setDones] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  const decode = (csv: string) => [];

  const onImportDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const csv = event.target.value;
    setImportData(csv);

    const decodeResult = decode(csv);
    const [errors, dones] = decodeResult;
    setErrors(errors);
    setDones(dones);
  };

  const onImport = () => {
    destroyAll();
    for (const d of doneEntries) add(d);
    setSuccessMessage(`Imported ${doneEntries.length} dones`);
  };

  return (
    <>
      <div>
        <textarea
          className="relative z-10 block w-full rounded-md border p-2 font-mono text-xs"
          value={importData}
          onChange={onImportDataChange}
          rows={20}
          cols={200}
          placeholder={[
            "Enter comma-delimited entries, one per line in this format: ",
            "contactId,date,content ",
            "",
            "Example: ",
            "brent,2023-01-27,Added feature X",
          ].join("\n")}
        ></textarea>
        <div className="-mt-1 mb-2 rounded-md rounded-t-none border border-t-0 bg-neutral-50 p-2 pt-3">
          {errors.length > 0 ? (
            <div className="text-sm">
              <div className="flex flex-row gap-1 ">
                <IconExclamationCircleFilled className="text-lg text-danger" />
                <p>Can't import &mdash; check these lines:</p>
              </div>
              <ul>
                {errors.map((e, i) => (
                  <li key={i}>{e.message}</li>
                ))}
              </ul>
            </div>
          ) : doneEntries.length > 0 ? (
            <div className="flex flex-row gap-1 text-sm">
              <IconCircleCheckFilled className="text-lg text-success" />
              <p>{doneEntries.length} dones will be imported.</p>
            </div>
          ) : null}
        </div>
      </div>
      <div className="py-4">
        <Button
          onClick={onImport}
          intent="danger"
          disabled={doneEntries.length === 0 || errors.length > 0}
        >
          Replace ALL dones with imported data
        </Button>
        {successMessage ? (
          <div className="mt-2 flex flex-row items-center gap-2 text-sm">
            <IconCircleCheckFilled className="text-lg text-success" />
            {successMessage}
          </div>
        ) : null}
      </div>
    </>
  );
};

type Props = {
  contacts: any[];
  add(d: any): void;
  destroyAll(): void;
};
