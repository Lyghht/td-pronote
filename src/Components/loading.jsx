import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
            <img src="/src/assets/media/logo-nota.png" className="mb-3" alt="logo" width="200" height="200" />
            <Spinner animation="border" role="status" variant="primary" />
        </div>
    );
}

export default Loading;