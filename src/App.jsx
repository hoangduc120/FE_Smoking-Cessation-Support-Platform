import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useRouterElement from "./routes/useRouterElement";
import { useGoogleCallback } from "./hooks/useGoogleCallback";

function App() {
  const routerElement = useRouterElement();
  const navigate = useNavigate();
  const location = useLocation();

  useGoogleCallback();

  // Xử lý Payment callback (VNPay & MoMo)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const vnpTxnRef = searchParams.get('vnp_TxnRef');
    const vnpResponseCode = searchParams.get('vnp_ResponseCode');

    const momoPartnerCode = searchParams.get('partnerCode');
    const momoResultCode = searchParams.get('resultCode');

    if (vnpTxnRef && vnpResponseCode && location.pathname === '/') {
      if (vnpResponseCode === '00') {
        navigate(`/payment/success${location.search}`, { replace: true });
      } else {
        navigate(`/payment/failed${location.search}`, { replace: true });
      }
    }
    else if (momoPartnerCode && momoResultCode && location.pathname === '/') {
      if (momoResultCode === '0' || momoResultCode === 0) {
        navigate(`/payment/success${location.search}`, { replace: true });
      } else {
        navigate(`/payment/failed${location.search}`, { replace: true });
      }
    }
  }, [location, navigate]);

  return <>{routerElement}</>;
}

export default App;
