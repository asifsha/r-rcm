import React, { useState } from "react";
import "./Room.css";
import axios from "axios";

export function Room() {
  //const url = "http://localhost:5000/";

  const endpoint = "https://api.colabel.com/v1/models/195/prediction";

  const [predictions, setPredictions] = useState([]);

  const [disabled, setDisabled] = useState(false);

  const[loading,setLoading]=useState(false);

  const getData = async (file, isRemote) => {
    try {
      setLoading(true);
      const response = await axios({
        method: "post",
        url: endpoint,
        headers: {
          Authorization: "TOKEN 8346c616fc2bf94f0c9f4855f3cbb520a318fcef"
        },
        data: {
          file: file,
          is_remote: isRemote
        }
      });
      setLoading(false);
      setPredictions(response.data.predictions);
    } catch (error) {
      setLoading(false);
      console.error(error);
      setPredictions([{ label: "Error", score: "" }]);
    }
  };

  const renderTable = () => {
    if (loading) return <div>Loading...</div>;
    if (predictions.length > 0)
      return (
        <div className="field">
          <table>
            <tbody>
              <tr>
                <th>Room Type</th>
                <th>Score</th>
              </tr>
              {predictions.map(
                (
                  p //{
                ) => (
                  <tr key={p.label}>
                    <td>{p.label}</td>
                    <td>{p.score}</td>
                  </tr>
                )
                //}
              )}
            </tbody>
          </table>
          <h3>Result : {predictions[0].label}</h3>
        </div>
      );

    return null;
  };

  const onChangeHandler = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = event => {
      getData(event.target.result, false);
    };

    reader.onerror = err => {
      console.log(err);
    };
    const binaryData = reader.readAsBinaryString(file);
    getData(binaryData, false);
  };

  const onRemoteChangeHandler = event => {
    getData(event.target.value, true);
  };

  const onFileTypeChangeHandler = event => {
    if (event.target.value === "remote") setDisabled(false);
    else setDisabled(true);
  };

  return (
    <div>
      <h1>Select File</h1>
      <div className="field">
        <input
          type="radio"
          name="fileType"
          value="remote"
          onChange={onFileTypeChangeHandler}
          defaultChecked
        />
        Remote File Url &nbsp;
        <input
          type="url"
          name="fileType"
          onBlur={onRemoteChangeHandler}
          disabled={disabled}
          className="input-text"
        />
      </div>
      <div className="field">
        <input
          type="radio"
          name="fileType"
          value="local"
          onChange={onFileTypeChangeHandler}
        />
        Local File &nbsp;
        <input
          type="file"
          name="file"
          onChange={onChangeHandler}
          disabled={!disabled}
          className="input-text"
        />
      </div>
      <h2>Prediction Score</h2>
      {renderTable()}
    </div>
  );
}
