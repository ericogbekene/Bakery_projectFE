export default function ApiDocsPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Bakery API Documentation</h1>
          <p className="mt-2">Interactive API documentation and testing interface</p>
          <div className="mt-4 space-x-4">
            <a 
              href="https://editor.swagger.io/?url=http://localhost:3000/api/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              Open in Swagger Editor
            </a>
            <a 
              href="/api/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              View Raw JSON
            </a>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">API Endpoints Overview</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-blue-600 mb-2">Products</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">/api/products</code>
                  <span className="text-gray-600">Get all products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">/api/products</code>
                  <span className="text-gray-600">Create new product</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">/api/products/&#123;id&#125;</code>
                  <span className="text-gray-600">Get specific product</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-mono">PUT</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">/api/products/&#123;id&#125;</code>
                  <span className="text-gray-600">Update product</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">DELETE</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">/api/products/&#123;id&#125;</code>
                  <span className="text-gray-600">Delete product</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-blue-600 mb-2">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">/api/categories</code>
                  <span className="text-gray-600">Get all categories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">/api/categories</code>
                  <span className="text-gray-600">Create new category</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">/api/categories/&#123;slug&#125;</code>
                  <span className="text-gray-600">Get specific category</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-mono">PUT</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">/api/categories/&#123;slug&#125;</code>
                  <span className="text-gray-600">Update category</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">DELETE</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">/api/categories/&#123;slug&#125;</code>
                  <span className="text-gray-600">Delete category</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Quick Test Examples</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Get all products:</strong> <code className="bg-white px-2 py-1 rounded">curl http://localhost:3000/api/products</code></p>
              <p><strong>Get products by category:</strong> <code className="bg-white px-2 py-1 rounded">curl &quot;http://localhost:3000/api/products?category=signature-cakes&quot;</code></p>
              <p><strong>Create a product:</strong> <code className="bg-white px-2 py-1 rounded">curl -X POST http://localhost:3000/api/products -H &quot;Content-Type: application/json&quot; -d &apos;&#123;&quot;title&quot;:&quot;Test&quot;,&quot;description&quot;:&quot;Test cake&quot;,&quot;image&quot;:&quot;/test.jpg&quot;,&quot;categoryId&quot;:&quot;your-category-id&quot;&#125;&apos;</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 