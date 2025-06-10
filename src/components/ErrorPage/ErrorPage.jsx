import loiErrr from "../../assets/electrocuted-caveman-animation-404-error-page.gif";
import "./ErrorPage.css";
export default function ErrorPage() {
  return (
    <div className="error-page">
      <h1 className="error-title">404</h1>
      <img className="error-img" src={loiErrr} alt="404" />
      <p className="error-text">Có gì đó sai ở đây</p>
      <button className="error-button">Quay về trang chủ</button>
    </div>
  );
}
