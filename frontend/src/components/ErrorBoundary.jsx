import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 bg-rose-50/90 border-2 border-rose-200 rounded-3xl text-slate-800 space-y-4 my-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h4 className="font-heading font-black text-rose-950 text-base">
                {this.props.title || "Temporary Display Notice"}
              </h4>
              <p className="text-xs text-rose-700 font-medium">
                An unexpected state occurred while rendering this section. The rest of the page remains fully functional.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              <i className="fa-solid fa-rotate-right mr-1.5"></i>
              Refresh This Section
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
