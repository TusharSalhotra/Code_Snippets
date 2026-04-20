import { NextPage, NextPageContext } from "next";
import React from "react";
import Layout from "~/components/Layout";
import { isServer } from "~/common/util";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useAnalytics } from "reactfire";
import { logEvent } from "firebase/analytics";

type Props = {
  statusCode: number;
  message: string;
  stack: string;
};

const Error: NextPage<Props> = ({
  statusCode,
  message,
  stack,
  ...restError
}: Props) => {
  const analytics = useAnalytics();

  // Log the error in firebase analytics client-side only
  !isServer &&
    logEvent(analytics, "error", {
      page_location: location.href,
      statusCode,
      message,
      stack,
      restError,
    });

  const router = useRouter();

  const reload = () => {
    router.reload();
  };

  return (
    <Layout auth={false}>
      <div>
        <h1>Oops, something went wrong 🤔</h1>
        <h2>{statusCode}</h2>
        <pre>
          {message}
          {stack}
        </pre>
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={reload}
        >
          Try again
        </Button>
      </div>
    </Layout>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err?.toString() || "Something broke";
  const stack = err?.stack;
  return { statusCode, message, stack } as Props;
};

export default Error;