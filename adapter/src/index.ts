
const axios = require('axios');

var auth_token: string;
class Response {
    jobRunID: string;
    statusCode: number;
    status?: string;
    data?: any;
    error?: any;
    pending?: any;
}

export class JobRequest {
    id: string;
    data: Request;
}

export class Request {
    invoice_id: string;
    paid: boolean;
}

export class GetRequest extends Request {
    invoice_id: string;
}

const getInvoice = async (data: Request) => {
    return new Promise(((resolve, reject) => {
        
        console.log(Object.entries(data));
        if (!('invoice_id' in data))
            return reject({statusCode: 400, data: "missing required parameters"});

        const baseURL = 'https://www.paypal.com/invoice/payerView/detailsInternal/';

        const invoice_id = data.invoice_id;

        var re = new RegExp(/(?<=invoiceStatus isPaid\">).*?(?=<\/div)/)

        const url = baseURL + invoice_id;
        console.log(url);

        axios(url)
        .then((response: any) => {

            let current_invoice = <Request>{paid: false, invoice_id:invoice_id};
            try {
                
                if(response.status === 200) {
                    
                    const html = response.data.content;
                    
                    var paid = html.match(re)
                    
                    if (paid == null){
                            //not paid
                            return resolve({statusCode: response.status, data: current_invoice});
                        }else{                           
                                current_invoice.paid = true;
                                return resolve({statusCode: response.status, data: current_invoice});                 
                            }

                    }else{
                        return resolve({statusCode: response.status, data: current_invoice});   
                        }
                }catch(error) {
                    return resolve({statusCode: 404, data: current_invoice});   
                }
        
        }).catch((error:any) => {
            return reject({statusCode: 404, data: error});
        });
    
    }))
};


//getinvoice

export const createRequest = async (input: JobRequest) => {
    return new Promise((resolve, reject) => {
                const data = input.data;

        getInvoice(<Request>data)
            .then((response: any) => {
                return resolve(response);
            }).catch(reject);

    })
};

export const requestWrapper = async (req: JobRequest): Promise<Response> => {
    
    return new Promise<Response>(resolve => {
        let response = <Response>{jobRunID: req.id || ""};
        
        createRequest(req).then(({statusCode, data}) => {
            
            response.status = "success";
            response.data = data;
            response.statusCode = statusCode;
            console.log(Object.entries(response));
            
            resolve(response)
            
        }).catch(({statusCode, data}) => {
            response.status = "errored";
            response.error = data;
            response.statusCode = statusCode;            
            
            resolve(response)
        });
    });
};

// createRequest() wrapper for GCP
export const gcpservice = async (req: any = {}, res: any): Promise<any> => {
    let response = await requestWrapper(<JobRequest>req.body);
    res.status(response.statusCode).send(response);
};

// createRequest() wrapper for AWS Lambda
export const handler = async (
    event: JobRequest,
    context: any = {},
    callback: { (error: any, result: any): void }): Promise<any> => {
    callback(null, await requestWrapper(event));
};
