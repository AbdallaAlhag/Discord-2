import WumpusQuestionMark from "../assets/WumpusQuestionMark.png";
const ErrorPage = () => {
  return (
    <div
      className="error-page"
      style={{
        backgroundImage: `url(${WumpusQuestionMark})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    ></div>
  );
};

export default ErrorPage;
