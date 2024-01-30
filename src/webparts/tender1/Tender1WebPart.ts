import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import { ITender1Props } from './components/ITender1Props';
// import Supplier from './components/Supplier';
// import SupplierDashboard from './components/SupplierDashboard';
// import Tender1 from './components/Tender1';
import App from './components/App';




// export interface ITender1WebPartProps {
//   description: string;
// }

export default class Tender1WebPart extends BaseClientSideWebPart<{}> {



  public render(): void {
    const element: React.ReactElement<{}> = React.createElement(
      
    App,
      // {
      //    description: this.properties.description,
      //    webURL: this.context.pageContext.web.absoluteUrl,
      //    context:this.context
      // }
    );

    ReactDom.render(element, this.domElement);
  }


  // protected onDispose(): void {
  //   ReactDom.unmountComponentAtNode(this.domElement);
  // }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  
}


