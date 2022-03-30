import ErrorLayoutComponent from "../../component/ErrorLayoutComponent"
import ErrorImg from "../../images/ErrorImages/invalid-authorization-code.png"

const InvalidAuthorizationCode = (props) => {
	return (
        <div className="mainErrorDiv">
            <ErrorLayoutComponent 
                imgsrc={ErrorImg}
                title={"Oops! No Internet"}
                text={"Slow or no internet connection.Please check your internet settings and try again"}
            />            
        </div>
	)
}

export default InvalidAuthorizationCode
