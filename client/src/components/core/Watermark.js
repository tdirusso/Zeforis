import { Box } from "@mui/material";
import zeforisLogo from '../../assets/zeforis-logo.png';
import './styles/Watermark.scss';

export default function Watermark(props) {

  const {
    positionStyle = {}
  } = props;

  return (
    <Box
      className="watermark"
      component="a"
      href="https://www.zeforis.com"
      style={positionStyle}
      target="_blank">
      Powered by  <img src={zeforisLogo} alt="Zeforis" height={13} style={{ marginLeft: '4px' }} />
    </Box>
  );
};
